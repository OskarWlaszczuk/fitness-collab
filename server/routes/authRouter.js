import express from "express";
import { login, logout, refreshAccessToken, register } from "../controllers/authControllers.js";
import { checkIsRefreshTokenPassed } from "../middlewares/checkIsRefreshTokenPassed.js";
import { validateRefreshTokenSignature } from "../middlewares/validateRefreshTokenSignature.js";
import { checkUserExists } from "../middlewares/checkUserExists.js";
import { checkIsRefreshTokenIntegrated } from "../middlewares/checkIsRefreshTokenIntergrated.js";
import { checkIsTokenSessionActive } from "../middlewares/checkIsTokenSessionActive.js";

const authRouter = express.Router();

authRouter.route("/login").post(login);
authRouter.route("/register").post(register);
authRouter.route("/logout").delete(
    checkIsRefreshTokenPassed,
    validateRefreshTokenSignature,
    checkUserExists,
    checkIsTokenSessionActive,
    checkIsRefreshTokenIntegrated,
    logout
);
authRouter.route("/refreshAccessToken").get(
    checkIsRefreshTokenPassed,
    validateRefreshTokenSignature,
    checkUserExists,
    checkIsTokenSessionActive,
    checkIsRefreshTokenIntegrated,
    refreshAccessToken
);
export default authRouter;