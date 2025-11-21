import express from "express";
import { deleteSet, editSet } from "../controllers/setControllers.js";

const setRouter = express.Router();

setRouter.route("/:id")
    .delete(deleteSet)
    .put(editSet);

export default setRouter;