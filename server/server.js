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

app.listen(5000, () => {
    console.log("Server is listening on port 5000...");
})