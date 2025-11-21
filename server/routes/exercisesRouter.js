import express from "express";
import { getExerciseInstructions } from "../controllers/exercisesControllers.js";

const exercisesRouter = express.Router();

exercisesRouter.route("/:id/instructions").get(getExerciseInstructions);

export default exercisesRouter;