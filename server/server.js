import { config } from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRouter from "./routes/authRouter.js";
import { globalErrorHandler } from "./controllers/errorControllers.js";
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

const fallbackApiHandler = (request, response, next) => {
    const error = new Error(`Can't find ${request.originalUrl} on the server`);
    error.status = "fail";
    error.statusCode = 404;

    next(error);
};

app.use(fallbackApiHandler);
app.use(globalErrorHandler);

app.listen(5000, () => {
    console.log("Server is listening on port 5000...");
})