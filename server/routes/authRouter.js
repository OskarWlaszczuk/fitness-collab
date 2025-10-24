import express from "express";
import { login, logout, refreshAccessToken, register } from "../controllers/authControllers.js";
import { isRefreshTokenStoredInCoookies } from "../middlewares/isRefreshTokenStoredInCoookies.js";
import { isRefreshTokenSecretValid } from "../middlewares/isRefreshTokenSecretValid.js";
import { isUserExists } from "../middlewares/isUserExists.js";
import { isRefreshTokenSessionFresh } from "../middlewares/isRefreshTokenSessionFresh.js";

const authRouter = express.Router();

authRouter.route("/login").post(login);
authRouter.route("/register").post(register);
authRouter.route("/logout").delete(isRefreshTokenStoredInCoookies, isRefreshTokenSecretValid, isUserExists, isRefreshTokenSessionFresh, logout);
authRouter.route("/refreshAccessToken").get(isRefreshTokenStoredInCoookies, isRefreshTokenSecretValid, isUserExists, isRefreshTokenSessionFresh, refreshAccessToken);
export default authRouter;
