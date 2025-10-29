import express from "express";
import { getUserProfile } from "../controllers/usersControllers.js";
import { checkIsAccessTokenPassed } from "../middlewares/checkIsAccessTokenPassed.js";
import { validateAccessTokenSignature } from "../middlewares/validateAccessTokenSignature.js";
import { checkUserExists } from "../middlewares/checkUserExists.js";

const usersRouter = express.Router();

usersRouter.get("/profile", checkIsAccessTokenPassed, validateAccessTokenSignature, checkUserExists, getUserProfile);

export default usersRouter;