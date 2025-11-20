import format from "pg-format";
import { pool } from "../db";

export const saveExcersiseEntry = async ({ exerciseId, traineeId, sets, workoutId }) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        await client.query(
            "INSERT INTO trainee_log_excersises (excersise_id, trainee_id) \
            VALUES($1, $2) \
            ON CONFLICT(excersise_id, trainee_id) \
            DO NOTHING ",
            [exerciseId, traineeId]
        );

        const { rows: logExcersiseRows } = await client.query(
            "SELECT \
            id \
            FROM trainee_log_excersises \
            WHERE excersise_id = $1 AND trainee_id = $2",
            [exerciseId, traineeId]
        );

        const logExcersiseId = logExcersiseRows[0].id;

        const { rows: entryRows } = await client.query(
            "INSERT INTO trainee_log_excersise_entries (trainee_log_excersise_id, workout_plan_day_id) \
            VALUES ($1, $2)\
            RETURNING id",
            [logExcersiseId, workoutId]
        );

        const entryId = entryRows[0].id;

        const setsQueryValues = sets.map(set => [
            entryId,
            ...Object.values(set)
        ]);

        const insertSetsQuery = format(
            'INSERT INTO trainee_log_excersise_entry_sets  ( \
                trainee_log_excersise_entry_id, \
                reps,\
                weight_kg,\
                eccentric_length_seconds, \
                concentric_length_seconds,\
                eccentric_pause_length_seconds, \
                concentric_pause_length_seconds\
            ) VALUES %L',
            setsQueryValues
        );

        await client.query(insertSetsQuery);

        await client.query("COMMIT");
    } catch (err) {
        await client.query("ROLLBACK");
        throw err
    } finally {
        client.release();
    }
};