import { pool } from "../db.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";

export const getRoles = asyncErrorHandler(async (request, response, next) => {
    const { rows: roles } = await pool.query("SELECT id, name FROM roles");

    return response
        .status(200)
        .json({ roles });
});