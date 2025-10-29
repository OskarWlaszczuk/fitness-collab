import { pool } from "../db.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";

export const getUserProfile = asyncErrorHandler(async (request, response, next) => {
    const { tokenPayload } = request;

    const { rows: userRows } = await pool.query(
        "SELECT nickname FROM users WHERE id = $1",
        [tokenPayload.userId]
    );

    const user = userRows[0];
    console.log("selected user:", user);

    response.status(200).json({ user });
})