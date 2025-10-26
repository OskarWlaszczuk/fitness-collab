import express from "express";
import { getModes } from "../controllers/modesController";

const modesRouter = express.Router();

modesRouter
    .get("/", getModes);

export default modesRouter;