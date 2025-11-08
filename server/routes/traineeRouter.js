import express from "express";
import { getTraineeProfile, getTraineeWorkoutPlans, getTraineeWorkoutPlan, getWorkout } from "../controllers/traineeControllers.js";

const traineeRouter = express.Router();

traineeRouter.get("/workout-plans/:id", getTraineeWorkoutPlan);
traineeRouter.get("/workout-plans", getTraineeWorkoutPlans);
traineeRouter.get("/profile", getTraineeProfile);
traineeRouter.get("/workout-plans/workout", getWorkout);

export default traineeRouter;