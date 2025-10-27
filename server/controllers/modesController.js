import { pool } from "../db.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";

export const getModes = asyncErrorHandler(async (request, response, next) => {
    const { rows: modes } = await pool.query("SELECT id, name FROM modes");

    return response
        .status(200)
        .json({ modes });
});