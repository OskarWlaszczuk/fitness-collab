import express, { response } from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { pool } from "./db.js";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Wczytaj .env z głównego folderu projektu
config({ path: path.resolve(__dirname, "../.env") });

export const generateAccessToken = (userPayload) => {
    const accessToken = jwt.sign(
        userPayload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "90m" }
    );

    return accessToken;
};


const app = express();
const corsOptions = {
    origin: ["http://localhost:5137"],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/public")));

app.get("/api", async (request, response) => {
    const existingEmails = await pool.query('SELECT * FROM users WHERE email = $1', ["piotrhajduk@gmail.com"]);
    return response.json({ rows: existingEmails.rows })
});

app.post('/api/auth/register', async (request, response) => {
    try {
        const { email, name, surname, nickname, password, role } = request.body;
        console.log(`registering user ${name}...`);

        // sprawdź, czy role nie istenieje
        const existingRoles = await pool.query('SELECT * FROM roles WHERE name = $1', [role]);
        if (!existingRoles.rows.length) {
            console.log(existingRoles, role);

            return response
                .status(400)
                .json({ message: "Invalid role" });
        }
        console.log('role exists');

        // sprawdź, czy email nie istnieje
        const existingEmails = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingEmails.rows.length > 0) {
            return response.status(409).json({ message: "Email already registered" });
        }
        console.log('email unique');

        // sprawdź, czy nickname nie istnieje
        const existingNicknames = await pool.query('SELECT * FROM users WHERE nickname = $1', [nickname]);
        if (existingNicknames.rows.length > 0) {
            return response.status(409).json({ message: "Nickname already registered" });
        }
        console.log('nickname unique');

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('inserting user...');

        const { rows: userRows } = await pool.query(
            'INSERT INTO users (email, name, surname, nickname, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [email, name, surname, nickname, hashedPassword]
        );
        console.log('user inserted');

        const user = userRows[0];

        if (role === "trainer") {
            console.log("role is trainer");

            await pool.query(
                'INSERT INTO trainers (user_id) VALUES ($1)',
                [user.id]
            );
        }

        if (role === "client") {
            console.log("role is client");

            await pool.query(
                'INSERT INTO clients (user_id) VALUES ($1)',
                [user.id]
            );
        }

        const tokenPayload = {
            userId: user.id,
            role,
        };

        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET);

        response.cookie(
            process.env.COOKIE_PATH,
            refreshToken,
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: process.env.COOKIE_PATH,
                maxAge: 7 * 24 * 3600 * 1000,
            }
        );

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        await pool.query(
            "UPDATE users SET refresh_token_hash = $1 WHERE id = $2",
            [hashedRefreshToken, user.id]
        );

        return response.json({ accessToken, user,role })
    } catch (error) {
        console.log(error);
    }
});

app.listen(5000, () => {
    console.log("Server is listening on port 5000...");
})