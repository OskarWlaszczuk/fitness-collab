import express from "express";
import { getRoles } from "../controllers/rolesController.js";

const rolesRouter = express.Router();

rolesRouter
    .get("/", getRoles);

export default rolesRouter;