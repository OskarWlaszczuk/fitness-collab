import { pool } from "../db.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";

export const getUserActiveMode = asyncErrorHandler(async (request, response, next) => {
    const { tokenPayload } = request;
    //service
    const { rows: modeRows } = await pool.query(
        "SELECT id, name FROM modes WHERE id = $1",
        [tokenPayload.modeId]
    );

    const mode = modeRows[0];
    return response.status(200).json({ mode });
});

export const getTrainerProfil = asyncErrorHandler(async (request, response, next) => {
    const { tokenPayload } = request;

    const { rows: userRows } = await pool.query(
        "SELECT *  FROM users WHERE id = $1",
        [tokenPayload.userId]
    );

    const user = userRows[0];
    console.log("selected user:", user);

    response.status(200).json({ user, message: "Welcome trainer" });
});

export const getTraineeProfile = asyncErrorHandler(async (request, response, next) => {
    const { tokenPayload } = request;

    const { rows: userRows } = await pool.query(
        "SELECT *  FROM users WHERE id = $1",
        [tokenPayload.userId]
    );

    const user = userRows[0];
    console.log("selected user:", user);

    response.status(200).json({ user, message: "Welcome trainee" });
});