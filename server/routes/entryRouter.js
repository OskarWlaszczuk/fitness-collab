import express from "express";
import { addEntry } from "../controllers/entryControllers.js";

const entryRouter = express.Router();

entryRouter.route("/")
    .post(addEntry);

export default entryRouter;