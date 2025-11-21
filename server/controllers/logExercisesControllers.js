import { pool } from "../db.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";

export const getLogExerciseEntry = asyncErrorHandler(async (request, response, next) => {
    const { tokenPayload } = request;
    const { id: logExcersiseId } = request.params;

    const { rows: traineeRows } = await pool.query("SELECT id FROM trainees WHERE user_id = $1", [tokenPayload.userId]);
    const traineeId = traineeRows[0].id;
    //walidacja, czy trainee posiada to ćwicenie w dzienniku 

    const { rows: logExcersiseEntryRows } = await pool.query(
        "SELECT \
        id, \
        created_at AS createdAt \
        FROM trainee_log_excersise_entries \
        ORDER BY created_at DESC \
        LIMIT 1 \
        WHERE trainee_log_excersise_id = $1",
        [logExcersiseId]
    );

    const logExcersiseEntry = logExcersiseEntryRows[0]

    const { rows: entrySets } = await pool(
        "SELECT \
            id, \
            set_number, \
            reps, \
            weight_kg, \
            eccentric_length_seconds, \
            concentric_length_seconds, \
            eccentric_pause_length_secounds, \
            concentric_pause_length_seconds \
        FROM trainee_log_excersise_entry_sets \
        WHERE trainee_log_excersise_entry_id = $1",
        [logExcersiseEntry.id]
    );

    return response
        .status(200)
        .json({
            entry: {
                ...logExcersiseEntry,
                sets: entrySets,
            }
        });
});