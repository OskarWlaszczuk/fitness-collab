import { config } from "dotenv";
import { pool } from "../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

config();
//czy poniższe funkcje to servicy?

//helpers
const generateAccessToken = (tokenPayload) => {
    const accessToken = jwt.sign(
        tokenPayload,
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TTL,
        }
    );

    return accessToken;
};
const generareJWTs = async ({ user, role }) => {
    try {
        const tokenPayload = {
            userId: user.id,
            role
        };

        const accessToken = generateAccessToken(tokenPayload);

        const refreshToken = jwt.sign(
            tokenPayload,
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TTL
            }
        );

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        return { accessToken, refreshToken, hashedRefreshToken };
    } catch (error) {
        throw error
    }
};

//services
const startUserTokenSession = async ({ client, userId, hashedRefreshToken }) => {
    await client.query(
        "UPDATE users SET refresh_token_hash = $1 WHERE id = $2",
        [hashedRefreshToken, userId]
    );
};

const registerUser = async ({ userData, role }) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { rows: userRows } = await client.query(
            "INSERT INTO users (email, name, surname, nickname, password_hash) \
            VALUES ($1, $2, $3, $4, $5) \
            RETURNING id, name, surname, email, nickname, created_at",
            [...userData]
        );
        const user = userRows[0];
        console.log("Inserted new user:", user);

        if (role === "trainer") {
            console.log(`registering new ${role}...`);

            await client.query('INSERT INTO trainers (user_id) VALUES ($1)', [user.id]);
        }

        if (role === "client") {
            console.log(`registering new ${role}...`);

            await client.query('INSERT INTO clients (user_id) VALUES ($1)', [user.id]);
        }

        const { accessToken, refreshToken, hashedRefreshToken } = generareJWTs({ role, user });

        await startUserTokenSession({ client, hashedRefreshToken, userId: user.id })

        await client.query('COMMIT');

        return {
            accessToken,
            refreshToken,
            user,
        };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export const findRoleByName = async (roleName) => {
    const { rows: roleRows } = await pool.query('SELECT * FROM roles WHERE name = $1', [roleName]);
    return roleRows;
};

//controllers
export const getTrainerName = async (request, response) => {
    const { trainerId } = request.body;

    try {
        //pobranie user_id
        const { rows: trainerRows } = await pool.query('SELECT user_id FROM trainers WHERE id = $1', [trainerId]);

        if (!trainerRows.length) {
            console.log('Trainer does not exist');

            return response
                .status(409)
                .json({ message: "Trainer does not exist" });
        }

        const { user_id: userId } = trainerRows[0];

        const { rows: userRows } = await pool.query('SELECT name FROM users WHERE id = $1', [userId]);
        const { name } = userRows[0];

        return response.status(200).json({ name });
    } catch (error) {
        console.log(error);
        return response
    }
};

export const register = async (request, response) => {
    try {
        const { email, name, surname, nickname, password, role } = request.body;
        console.log(`Registering user ${name}...`);

        //service sprawdzający czy rola istnieje
        const roleRows = findRoleByName(role);
        if (!roleRows.length) {
            console.log("Role does not exist");

            return response
                .status(400)
                .json({ message: "Invalid role" });
        }

        const existingEmails = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingEmails.rows.length > 0) {
            console.log("Email is already registered");

            return response.status(409).json({ message: "Email already registered" });
        }

        const existingNicknames = await pool.query('SELECT * FROM users WHERE nickname = $1', [nickname]);
        if (existingNicknames.rows.length > 0) {
            console.log("Nickname is already registered");

            return response.status(409).json({ message: "Nickname already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { accessToken, user, refreshToken } = registerUser({
            userData: [email, name, surname, nickname, hashedPassword],
            role,
        });

        response.cookie(
            process.env.COOKIE_NAME,
            refreshToken,
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: process.env.COOKIE_PATH,
                maxAge: 7 * 24 * 3600 * 1000,
            }
        );

        return response
            .status(200)
            .json({
                accessToken,
                user,
                role
            });

    } catch (error) {
        console.log(error);

        return response
            .status(500)
            .json({
                success: false,
                message: "Internal server error"
            });
    }
};

export const login = async (request, response) => {
    const { email, password, role } = request.body;
    console.log(`logging ${role} ${email}...`);

    try {
        const roleRows = findRoleByName(role);

        if (!roleRows.length) {
            console.log('Role does not exist');

            return response
                .status(400)
                .json({ success: false, message: "Role doesn't exist" });
        }

        const { rows: userRows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (!userRows.length) {
            console.log('Email does not exist');

            return response
                .status(409)
                .json({ message: "Email does not registered" });
        }

        const { password_hash, refresh_token_hash, ...user } = userRows[0];
        console.log(user);

        const isValidPassword = await bcrypt.compare(password, password_hash);
        if (!isValidPassword) {
            //czy w sytuacji, gdy isValidPassword jest false powinienem obsłużyć ten błąd tutaj w warunku bloku try i tuaj zwrócić odpowiedź, czy rzuci wyjątek i obsłużyć go catch?
            return response
                .status(401)
                .json({ success: false, message: "Invalid password" });
        }

        const { accessToken, refreshToken, hashedRefreshToken } = await generareJWTs({ user, role });
        await startUserTokenSession({ client: pool, hashedRefreshToken, userId: user.id })

        response.cookie(
            process.env.COOKIE_NAME,
            refreshToken,
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: process.env.COOKIE_PATH,
                maxAge: 7 * 24 * 3600 * 1000,
            }
        );

        response
            .status(201)
            .json({
                success: true,
                data: {
                    user,
                    role,
                    accessToken,
                }
            });
    } catch (error) {
        console.error("error in login controller", error.message);
        response
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};