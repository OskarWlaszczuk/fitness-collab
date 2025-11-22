import { pool } from "../db.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/customError.js";

export const editSet = asyncErrorHandler(async (request, response, next) => {
    const { tokenPayload } = request;
    const { id } = request.params;
    const { set } = request.body;

    const { rows: traineeRows } = await pool.query("SELECT id FROM trainees WHERE user_id = $1", [tokenPayload.userId]);

    //podopieczny nie istnieje
    if (!traineeRows.length) {
        const error = new CustomError("Trainee not found", 404);
        return next(error);
    }

    const traineeId = traineeRows[0].id;

    const { rows: setRows } = await pool.query(
        "SELECT \
            trainee_log_excersise_entry_sets.trainee_log_excersise_entry_id AS entry_id \
        FROM trainee_log_excersise_entry_sets WHERE id = $1",
        [id]
    );
    //set nie istnieje
    if (!setRows.length) {
        return response.status(404).json({ message: "Set not found" });
    }

    const entryId = setRows[0].entry_id;

    const { rows: traineeEntryRows } = await pool.query(
        "SELECT EXISTS ( \
            SELECT \
                1 \
            FROM trainee_log_excersise_entries \
            JOIN trainee_log_excersises \
            ON trainee_log_excersise_entries.trainee_log_excersise_id = trainee_log_excersises.id \
            WHERE trainee_log_excersise_entries.id = 33 AND trainee_log_excersises.trainee_id = 3 \
            ) \"",
        [entryId, traineeId]
    );

    //sprawdzenie czy podopieczny ma dostęp do tego seta
    const hasTraineeAccess = traineeEntryRows[0].exists;

    if (!hasTraineeAccess) {
        const error = new CustomError("You do not have permission to edit this set", 403);
        return next(error);
    }

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
    const { tokenPayload } = request;
    const { id } = request.params;

    const { rows: traineeRows } = await pool.query("SELECT id FROM trainees WHERE user_id = $1", [tokenPayload.userId]);

    //podopieczny nie istnieje
    if (!traineeRows.length) {
        const error = new CustomError("Trainee not found", 404);
        return next(error);
    }

    const traineeId = traineeRows[0].id;

    const { rows: setRows } = await pool.query(
        "SELECT \
            trainee_log_excersise_entry_sets.trainee_log_excersise_entry_id AS entry_id \
        FROM trainee_log_excersise_entry_sets WHERE id = $1",
        [id]
    );
    //set nie istnieje
    if (!setRows.length) {
        return response.status(404).json({ message: "Set not found" });
    }

    const entryId = setRows[0].entry_id;

    const { rows: traineeEntryRows } = await pool.query(
        "SELECT EXISTS ( \
            SELECT \
                1 \
            FROM trainee_log_excersise_entries \
            JOIN trainee_log_excersises \
            ON trainee_log_excersise_entries.trainee_log_excersise_id = trainee_log_excersises.id \
            WHERE trainee_log_excersise_entries.id = 33 AND trainee_log_excersises.trainee_id = 3 \
            ) \"",
        [entryId, traineeId]
    );

    //sprawdzenie czy podopieczny ma dostęp do tego seta
    const hasTraineeAccess = traineeEntryRows[0].exists;

    if (!hasTraineeAccess) {
        const error = new CustomError("You do not have permission to edit this set", 403);
        return next(error);
    }

    await pool.query(
        "DELETE FROM trainee_log_excersise_entry_sets \
        WHERE id = $1",
        [id]
    );

    response.status(200).json({ id });
});