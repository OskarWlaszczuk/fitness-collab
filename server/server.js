import { config } from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRouter from "./routes/authRouter.js";
config();

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

app.use("/api/auth", authRouter);

app.use((request, response, next) => {
    const error = new Error(`Can't find ${request.originalUrl} on the server`);
    error.status = "fail";
    error.statusCode = 404;

    next(error);
});

const globalErrorMiddleware = (error, request, response, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";

    console.log(error);

    response
        .status(error.statusCode)
        .json({ message: error.message, status: error.statusCode });
};

app.use(globalErrorMiddleware);

app.listen(5000, () => {
    console.log("Server is listening on port 5000...");
})