import express from "express";
import {
    getTraineeProfile,
    getTraineeWorkoutPlans,
    getTraineeExcersiseLastEntrySets,
    getExcersiseInstructions,
} from "../controllers/traineeControllers.js";

const traineeRouter = express.Router();

traineeRouter.get("/workout-plans", getTraineeWorkoutPlans);
traineeRouter.get("/profile", getTraineeProfile);

traineeRouter.get("/excersise/:id/entry", getTraineeExcersiseLastEntrySets);
traineeRouter.get("/excersise/:id/instructions", getExcersiseInstructions);

export default traineeRouter;