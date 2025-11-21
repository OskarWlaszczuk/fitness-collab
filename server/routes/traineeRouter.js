import express from "express";
import {
    getTraineeProfile,
    getTraineeWorkoutPlans,
    getTraineeExcersiseLastEntrySets,
} from "../controllers/traineeControllers.js";

const traineeRouter = express.Router();

traineeRouter.get("/workout-plans", getTraineeWorkoutPlans);
traineeRouter.get("/profile", getTraineeProfile);

traineeRouter.get("/excersise/:id/entry", getTraineeExcersiseLastEntrySets);

export default traineeRouter;