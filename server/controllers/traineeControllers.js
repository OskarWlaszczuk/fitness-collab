import { pool } from "../db.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/CustomError.js";

export const getTraineeWorkoutPlans = asyncErrorHandler(async (request, response, next) => {
    const { tokenPayload } = request;

    const { rows: traineeRows } = await pool.query("SELECT id FROM trainees WHERE user_id = $1", [tokenPayload.userId]);
    const trainee = traineeRows[0];

    const { rows: workoutPlans } = await pool.query(
        "SELECT \
        workout_plans.id AS id, \
        workout_plans.name AS name,\
        json_build_object( \
            'id', trainers.id, \
            'name', users.name,\
            'surname', users.surname\
        ) AS trainer, \
        (\
            SELECT json_agg(\
                json_build_object(\
                    'id', workout_plan_days.id,\
                    'name', workout_plan_days.name,\
                    'weekDay', workout_plan_days.week_day,\
                    'workoutPlanId', workout_plan_days.workout_plan_id\
                ) \
            ) \
            FROM workout_plan_days \
            WHERE workout_plans.id = workout_plan_days .workout_plan_id \
        ) AS workouts\
        FROM workout_plans \
        JOIN trainers  ON trainers.id = workout_plans.trainer_id\
        JOIN users  ON users.id = trainers.user_id\
        WHERE workout_plans.trainee_id = $1",
        [trainee.id]
    );

    return response
        .status(200)
        .json({
            workoutPlans
        });
});

export const getTraineeProfile = asyncErrorHandler(async (request, response, next) => {
    const { tokenPayload } = request;
    //pobieranie danych z tabeli trainee
    const { rows: userRows } = await pool.query(
        "SELECT *  FROM users WHERE id = $1",
        [tokenPayload.userId]
    );

    const user = userRows[0];
    console.log("selected user:", user);

    response.status(200).json({ user });
});

export const getTraineeExcersiseLastEntrySets = asyncErrorHandler(async (request, response, next) => {
    const { tokenPayload } = request;
    const { id: excersiseId } = request.params;

    const { rows: traineeRows } = await pool.query("SELECT id FROM trainees WHERE user_id = $1", [tokenPayload.userId]);
    const traineeId = traineeRows[0].id;

    //uzyskiwanie traineeId - request.body, tokenPayload, czy middleware, dodający traineeId do request?
    const { rows: logExcersiseRows } = await pool.query(
        "SELECT id \
        FROM trainee_log_excersises \
        WHERE trainee_id = $1 AND excersise_id = $2",
        [traineeId, excersiseId]
    );


    if (!logExcersiseRows.length) {
        return response.status(204).json({ entry: null });
    }

    const logExcersise = logExcersiseRows[0];

    const { rows: logExcersiseEntryRows } = await pool.query(
        "SELECT \
        id, \
        created_at AS createdAt \
        FROM trainee_log_excersise_entries \
        ORDER BY created_at DESC \
        LIMIT 1 \
        WHERE trainee_log_excersise_id = $1",
        [logExcersise.id]
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

export const getExcersiseInstructions = asyncErrorHandler(async (request, response, next) => {
    const { id: excersiseId } = request.params;
    //zmienić zapytania
    const { rows: excersiseIntructions } = await pool.query(
        "SELECT excersise_instructions.id, description, name AS category \
        FROM excersise_instructions \
        JOIN instruction_categories \
        ON excersise_instructions.instruction_category_id = instruction_categories.id \
        WHERE excersise_instructions.excersise_id = $1",
        [excersiseId]
    );

    return response.status(200).json({ instructions: excersiseIntructions })
});