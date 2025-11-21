import express from "express";
import { getLogExerciseEntry } from "../controllers/logExercisesControllers.js";

const logExercisesRouter = express.Router();

logExercisesRouter
    .get("/:id/entry", getLogExerciseEntry);

export default logExercisesRouter;