import express from "express";
import { login, register } from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.route("/login").
    post(login);
authRouter.route("/register").
    post(register);

export default authRouter;
