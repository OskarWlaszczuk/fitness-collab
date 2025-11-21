import express from "express";
import { getWorkoutPlan } from "../controllers/workoutPlanControllers.js";

const workoutPlanRouter = express.Router();

workoutPlanRouter.route("/:id")
    .get(getWorkoutPlan);

export default workoutPlanRouter;