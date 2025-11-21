import express from "express";
import { getWorkout } from "../controllers/workoutControllers";

const workoutRouter = express.Router();

workoutRouter.route("/:id")
    .get(getWorkout);

export default workoutRouter;