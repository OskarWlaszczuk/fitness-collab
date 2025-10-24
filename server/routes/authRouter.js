import express from "express";
import { login, logout, refreshAccessToken, register } from "../controllers/authControllers.js";
import { chechRefreshTokenInCookies } from "../middlewares/chechRefreshTokenInCookies.js";
import { validateRefreshTokenSecret } from "../middlewares/validateRefreshTokenSecret.js";
import { checkUserExists } from "../middlewares/checkUserExists.js";
import { validateTokenSession } from "../middlewares/validateTokenSession.js";

const authRouter = express.Router();

authRouter.route("/login").post(login);
authRouter.route("/register").post(register);
authRouter.route("/logout").delete(chechRefreshTokenInCookies, validateRefreshTokenSecret, checkUserExists, validateTokenSession, logout);
authRouter.route("/refreshAccessToken").get(chechRefreshTokenInCookies, validateRefreshTokenSecret, checkUserExists, validateTokenSession, refreshAccessToken);
export default authRouter;