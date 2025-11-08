import { pool } from "../db.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";

export const getUserActiveRole = asyncErrorHandler(async (request, response, next) => {
    const { tokenPayload } = request;
    //service
    const { rows: roleRows } = await pool.query(
        "SELECT id, name FROM roles WHERE id = $1",
        [tokenPayload.roleId]
    );

    const role = roleRows[0];
    console.log("Role:", role,tokenPayload);

    return response.status(200).json({ role });
});

export const getUserProfile = asyncErrorHandler(async (request, response, next) => {
    const { tokenPayload } = request;

    const { rows: userRows } = await pool.query(
        "SELECT *  FROM users WHERE id = $1",
        [tokenPayload.userId]
    );

    const user = userRows[0];
    console.log("selected user:", user);

    response.status(200).json({ user });
});