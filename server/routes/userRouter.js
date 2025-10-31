import express from "express";
import { getTraineeProfile, getTrainerProfil } from "../controllers/usersControllers.js";
import { checkIsAccessTokenPassed } from "../middlewares/checkIsAccessTokenPassed.js";
import { validateAccessTokenSignature } from "../middlewares/validateAccessTokenSignature.js";
import { checkUserExists } from "../middlewares/checkUserExists.js";
import { authorizeUserMode } from "../middlewares/authorizeUserMode.js";

const userRouter = express.Router();

userRouter.get(
    "/trainer/profile",
    checkIsAccessTokenPassed,
    validateAccessTokenSignature,
    authorizeUserMode([2]),
    checkUserExists,
    getTrainerProfil
);

userRouter.get(
    "/trainee/profile",
    checkIsAccessTokenPassed,
    validateAccessTokenSignature,
    authorizeUserMode([1]),
    checkUserExists,
    getTraineeProfile
);

export default userRouter;