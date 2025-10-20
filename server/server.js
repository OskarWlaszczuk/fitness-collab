import { config } from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { pool } from "./db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generateAccessToken = (userPayload) => {
    const accessToken = jwt.sign(
        userPayload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "90m" }
    );

    return accessToken;
};

export const initializeJWTsSession = async ({ response, user, role }) => {
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

        response.cookie(
            process.env.COOKIE_NAME,
            refreshToken,
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: process.env.COOKIE_PATH,
                maxAge: 7 * 24 * 3600 * 1000,
            });

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        await pool.query(
            "UPDATE users SET refresh_token_hash = $1 WHERE id = $2",
            [hashedRefreshToken, user.id]
        );

        return accessToken;
    } catch (error) {
        console.log("Error in startJWt function:", error);
        throw error
    }
};

const app = express();
const corsOptions = {
    origin: ["http://localhost:5137"],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/public")));

const login = async (request, response) => {
    const { email, password, role } = request.body;
    console.log(`logging ${role} ${email}...`);

    try {
        const { rows: roleRows } = await pool.query('SELECT * FROM roles WHERE name = $1', [role]);

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
            return response
                .status(401)
                .json({ success: false, message: "Invalid password" });
        }

        const accessToken = await initializeJWTsSession({ user, role, response });

        console.log("user logined");
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

const register = async (request, response) => {
    try {
        const { email, name, surname, nickname, password, role } = request.body;
        console.log(`Registering user ${name}...`);

        const existingRoles = await pool.query('SELECT * FROM roles WHERE name = $1', [role]);
        if (!existingRoles.rows.length) {
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

        const { rows: userRows } = await pool.query(
            "INSERT INTO users (email, name, surname, nickname, password_hash) \
            VALUES ($1, $2, $3, $4, $5) \
            RETURNING id, name, surname, email, nickname, created_at",
            [email, name, surname, nickname, hashedPassword]
        );
        console.log("Added new user");

        const user = userRows[0];
        console.log(user);

        if (role === "trainer") {
            console.log(`registering new ${role}...`);

            await pool.query(
                'INSERT INTO trainers (user_id) VALUES ($1)',
                [user.id]
            );
        }

        if (role === "client") {
            console.log(`registering new ${role}...`);

            await pool.query(
                'INSERT INTO clients (user_id) VALUES ($1)',
                [user.id]
            );
        }

        const accessToken = await initializeJWTsSession({ user, role, response });

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

app.post("/api/auth/login", login);
app.post('/api/auth/register', register);

app.listen(5000, () => {
    console.log("Server is listening on port 5000...");
})