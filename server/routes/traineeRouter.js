import express from "express";
import {
    getTraineeProfile,
    getTraineeWorkoutPlans,
} from "../controllers/traineeControllers.js";

const traineeRouter = express.Router();

traineeRouter.get("/workout-plans", getTraineeWorkoutPlans);
traineeRouter.get("/profile", getTraineeProfile);

export default traineeRouter;