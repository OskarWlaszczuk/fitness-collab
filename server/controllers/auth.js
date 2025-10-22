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
const generareJWTs = async ({ userId, roleName }) => {
    try {
        const tokenPayload = {
            userId: userId,
            roleName,
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
export const startUserTokenSession = async ({ client, userId, hashedRefreshToken }) => {
    try {
        await client.query(
            "UPDATE users SET refresh_token_hash = $1 WHERE id = $2",
            [hashedRefreshToken, userId]
        );
    } catch (error) {
        throw error
    }
};

export const registerUser = async ({ userData, roleName }) => {
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

        switch (roleName) {
            case "trainer":
                await client.query('INSERT INTO trainers (user_id) VALUES ($1)', [user.id]);

                break;
            case "client":
                await client.query('INSERT INTO clients (user_id) VALUES ($1)', [user.id]);
                break;
            default:
                throw new Error("Unknown role");
        }

        const { accessToken, refreshToken, hashedRefreshToken } = generareJWTs({ role: roleName, user });

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
    try {
        const { rows: roleRows } = await pool.query('SELECT * FROM roles WHERE name = $1', [roleName]);
        console.log(roleName);

        const role = roleRows?.[0];
        const isRoleAvailable = roleRows.length > 0;

        return { role, isRoleAvailable };
    } catch (error) {
        //jakim błędem tu rzucić
        throw error
    }
};

export const findUserByEmail = async (userEmail) => {
    try {
        const { rows: userRows } = await pool.query('SELECT * FROM users WHERE email = $1', [userEmail]);

        const user = userRows?.[0];
        const isEmailRegistered = userRows.length > 0;

        return { isEmailRegistered, user };
    } catch (error) {
        //jakim błędem tu rzucić
        throw error
    }
};

export const findUserByNickname = async (userNickname) => {
    try {
        const { rows: userRows } = await pool.query('SELECT * FROM users WHERE nickname = $1', [userNickname]);

        const user = userRows?.[0];
        const isNicknameRegistered = userRows.length > 0;

        return { isNicknameRegistered, user };
    } catch (error) {
        //jakim błędem tu rzucić
        throw error
    }
};

//controllers

export const register = async (request, response) => {
    try {
        const { email, name, surname, nickname, password, roleName } = request.body;
        console.log(`Registering user ${name}...`);

        //service sprawdzający czy rola istnieje
        const { isRoleAvailable } = findRoleByName(roleName);

        if (!isRoleAvailable) {
            console.log("Role does not exist");
            //rzucać błędem o konkretnej nazwie i zwracać wszystkie błędne response w bloku catch?
            return response
                .status(400)
                .json({ message: "Invalid role" });
        }

        const { isEmailRegistered } = findUserByEmail(email);

        if (isEmailRegistered) {
            console.log("Email is already registered");

            return response.status(409).json({ message: "Email already registered" });
        }

        const { isNicknameRegistered } = findUserByNickname(nickname);

        if (isNicknameRegistered) {
            console.log("Nickname is already registered");

            return response.status(409).json({ message: "Nickname already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { accessToken, user, refreshToken } = registerUser({
            userData: [email, name, surname, nickname, hashedPassword],
            roleName,
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
    const { email, password, roleName } = request.body;
    console.log(`logging ${roleName} ${email}...`);

    try {
        const { isRoleAvailable } = findRoleByName(roleName);

        if (!isRoleAvailable) {
            console.log('Role does not exist');

            return response
                .status(400)
                .json({ success: false, message: "Role doesn't exist" });
        }

        const { isEmailRegistered, user } = findUserByEmail(email);

        if (!isEmailRegistered) {
            console.log('Email does not exist');

            return response
                .status(409)
                .json({ message: "Email does not registered" });
        }

        const { password_hash, refresh_token_hash, ...responseUserData } = user;

        const isValidPassword = await bcrypt.compare(password, password_hash);
        if (!isValidPassword) {
            //czy w sytuacji, gdy isValidPassword jest false powinienem obsłużyć ten błąd tutaj w warunku bloku try i tuaj zwrócić odpowiedź, czy rzuci wyjątek i obsłużyć go catch?
            return response
                .status(401)
                .json({ success: false, message: "Invalid password" });
        }

        const { accessToken, refreshToken, hashedRefreshToken } = await generareJWTs({ userId: user.id, roleName });
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
                    user: responseUserData,
                    role: roleName,
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