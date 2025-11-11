import express from "express";
import { getTraineeProfile, getTraineeWorkoutPlans, getTraineeWorkoutPlan, getTraineeWorkoutPlanDay, getTraineeExcersiseLastEntrySets, getExcersiseInstructions } from "../controllers/traineeControllers.js";

const traineeRouter = express.Router();

traineeRouter.get("/workout-plans/:id", getTraineeWorkoutPlan);
traineeRouter.get("/workout-plans", getTraineeWorkoutPlans);
traineeRouter.get("/profile", getTraineeProfile);
traineeRouter.get("/workout-plan-day/:id", getTraineeWorkoutPlanDay);
traineeRouter.get("/excersise/:id/entry", getTraineeExcersiseLastEntrySets);
traineeRouter.get("/excersise/:id/instructions", getExcersiseInstructions);

export default traineeRouter;