import express from "express";
import { getUserActiveMode, getUserProfile } from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.get("/profile", getUserProfile);
userRouter.get("/activeMode", getUserActiveMode);

export default userRouter;