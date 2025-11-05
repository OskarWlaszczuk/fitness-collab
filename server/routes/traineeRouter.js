import express from "express";
import { getTraineeWorkout, getTraineeWorkouts, getTraineeProfile } from "../controllers/traineeControllers.js";

const traineeRouter = express.Router();

traineeRouter.get("/workout-plans/:id", getTraineeWorkout);
traineeRouter.get("/workout-plans", getTraineeWorkouts);
traineeRouter.get("/profile", getTraineeProfile);

export default traineeRouter;