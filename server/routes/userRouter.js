import express from "express";
import { getUserActiveMode, getUserProfile } from "../controllers/usersControllers.js";

const userRouter = express.Router();

userRouter.get("/profile", getUserProfile);
userRouter.get("/activeMode", getUserActiveMode);

export default userRouter;