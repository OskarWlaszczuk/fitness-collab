import { pool } from "../db.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler";

export const getModes = asyncErrorHandler(async (request, response, next) => {
    const modes = await pool.query("SELECT id, name FROM modes");

    return response
        .status(200)
        .json({ modes });
});