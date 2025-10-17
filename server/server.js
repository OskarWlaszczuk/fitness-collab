import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const corsOptions = {
    origin: ["http://localhost:5137"],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/public")));

app.get("/api", (request, response) => {
    response.json({ data: "hello" })
})

const roles = ["trainer", "trainee"];

app.post('/api/register', async (request, response) => {
    const { email, name, surname, nickname, password, role, extraData } = request.body;
    // walidacja roli
    if (!roles.includes(role)) {
        return response.status(400).json({ error: "Invalid role" });
    }

    // sprawdź, czy email nie istnieje
    const existingEmails = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingEmails.rows.length > 0) {
        return response.status(409).json({ error: "Email already registered" });
    }
    const existingNicknames = await db.query('SELECT * FROM users WHERE nickname = $1', [nickname]);
    if (existingNicknames.rows.length > 0) {
        return response.status(409).json({ error: "Nickname already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db.query(
        'INSERT INTO users (email, name, surname, nickname, password_hash) VALUES ($1, $2, $3) RETURNING id',
        [email, name, surname, nickname, passwordHash]
    );
    const user = result.rows[0];

    if (role === "trainer") {
        const { experienceYears, description } = extraData;
        await db.query(
            'INSERT INTO trainers (user_id, experience_years, description) VALUES ($1, $2, $3)',
            [user.id, experienceYears, description]
        );
    }
    // wygeneruj token JWT
    const tokenPayload = { userId: user.id, role: user.role };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });
    response.json({ token, role: user.role });
});



app.listen(5000, () => {
    console.log("Server is listening on port 5000...");
})