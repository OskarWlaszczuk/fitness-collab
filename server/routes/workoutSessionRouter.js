import express from "express";
import { completeWorkoutSession, startWorkoutSession } from "../controllers/workoutSessionControllers.js";

const workoutSessionRouter = express.Router();

workoutSessionRouter.route("/start").post(startWorkoutSession);
workoutSessionRouter.route("/:id/completed").patch(completeWorkoutSession);

export default workoutSessionRouter;