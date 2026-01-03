import { config } from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRouter from "./routes/authRouter.js";
import { globalErrorHandler } from "./controllers/errorControllers.js";
import { CustomError } from "./utils/CustomError.js";
import rolesRouter from "./routes/rolesRouter.js";
import userRouter from "./routes/userRouter.js";
import traineeRouter from "./routes/traineeRouter.js";
import trainerRouter from "./routes/trainerRouter.js";
import { checkIsAccessTokenPassed } from "./middlewares/checkIsAccessTokenPassed.js";
import { validateAccessTokenSignature } from "./middlewares/validateAccessTokenSignature.js";
import { checkUserExists } from "./middlewares/checkUserExists.js";
import { authorizeUserRole } from "./middlewares/authorizeUserRole.js";
import entryRouter from "./routes/entryRouter.js";
import setRouter from "./routes/setRouter.js";
import workoutPlanRouter from "./routes/workoutPlanRouter.js";
import workoutRouter from "./routes/workoutRouter.js";
import exercisesRouter from "./routes/exercisesRouter.js";
import logExercisesRouter from "./routes/logExercisesRouter.js";
import workoutSessionRouter from "./routes/workoutSessionRouter.js";

config({ path: `${process.cwd()}/.env` });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const corsOptions = {
    origin: ["http://localhost:5173"],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/public")));

app.use("/api/auth", authRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/user", checkIsAccessTokenPassed, validateAccessTokenSignature, checkUserExists, userRouter);
app.use("/api/trainee", checkIsAccessTokenPassed, validateAccessTokenSignature, authorizeUserRole([1]), checkUserExists, traineeRouter);
app.use("/api/trainer", checkIsAccessTokenPassed, validateAccessTokenSignature, authorizeUserRole([2]), checkUserExists, trainerRouter);
app.use("/api/entry", checkIsAccessTokenPassed, validateAccessTokenSignature, authorizeUserRole([1]), checkUserExists, entryRouter);
app.use("/api/set", checkIsAccessTokenPassed, validateAccessTokenSignature, authorizeUserRole([1]), checkUserExists, setRouter);
app.use("/api/workout-plan", checkIsAccessTokenPassed, validateAccessTokenSignature, authorizeUserRole([1, 2]), checkUserExists, workoutPlanRouter);
app.use("/api/workout", checkIsAccessTokenPassed, validateAccessTokenSignature, authorizeUserRole([1, 2]), checkUserExists, workoutRouter);
app.use("/api/exercises", checkIsAccessTokenPassed, validateAccessTokenSignature, authorizeUserRole([1, 2]), checkUserExists, exercisesRouter);
app.use("/api/log-exercises", checkIsAccessTokenPassed, validateAccessTokenSignature, authorizeUserRole([1, 2]), checkUserExists, logExercisesRouter);
app.use("/api/workout-session", checkIsAccessTokenPassed, validateAccessTokenSignature, authorizeUserRole([1]), checkUserExists, workoutSessionRouter);

const fallbackApiHandler = (request, response, next) => {
    const error = new CustomError(`Can't find ${request.originalUrl} on the server`, 404);
    next(error);
};

app.use(fallbackApiHandler);
app.use(globalErrorHandler);

app.listen(5000, () => {
    console.log("Server is listening on port 5000...");
})