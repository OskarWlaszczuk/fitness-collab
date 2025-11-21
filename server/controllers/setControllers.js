import { pool } from "../db.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";

export const editSet = asyncErrorHandler(async (request, response, next) => {
    const { id } = request.params;
    const { set } = request.body;

    const { rows: updatedSetRows } = await pool.query(
        "UPDATE trainee_log_excersise_entry_sets \
        SET \
            reps = $1, \
            weight_kg = $2, \
            eccentric_length_seconds = $3, \
            concentric_length_seconds  = $4, \
            eccentric_pause_length_seconds  = $5, \
            concentric_pause_length_seconds  = $6 \
        WHERE id  = $7 \
        RETURNING *",
        [...Object.values(set), id]
    );

    const updatedSet = updatedSetRows[0];

    response.status(200).json({ set: updatedSet });
});

export const deleteSet = asyncErrorHandler(async (request, response, next) => {
    const { id } = request.params;

    await pool.query(
        "DELETE FROM trainee_log_excersise_entry_sets \
        WHERE id = $1",
        [id]
    );

    response.status(200).json({ id });
});