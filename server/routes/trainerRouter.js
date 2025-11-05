import express from "express";
import { getTrainerProfil } from "../controllers/trainerControllers.js";

const trainerRouter = express.Router();

trainerRouter.get("/profile", getTrainerProfil)

export default trainerRouter;