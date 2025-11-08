import express from "express";
import { getUserActiveRole, getUserProfile } from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.get("/profile", getUserProfile);
userRouter.get("/activeRole", getUserActiveRole);

export default userRouter;