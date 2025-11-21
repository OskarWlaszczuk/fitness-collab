import express from "express";
import { getWorkout } from "../controllers/workoutControllers.js";

const workoutRouter = express.Router();

workoutRouter.route("/:id")
    .get(getWorkout);

export default workoutRouter;