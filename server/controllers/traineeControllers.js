import { pool } from "../db.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/CustomError.js";

export const getTraineeWorkoutPlan = asyncErrorHandler(async (request, response, next) => {
    const { tokenPayload } = request;
    const { id } = request.params;

    const { rows: traineeRows } = await pool.query("SELECT id FROM trainees WHERE user_id = $1", [tokenPayload.userId]);
    const traineeId = traineeRows[0].id;

    const { rows: workoutPlanRows } = await pool.query("SELECT * FROM workout_plans WHERE trainee_id = $1 AND id = $2", [traineeId, id]);

    const workoutPlan = workoutPlanRows[0];

    const { rows: trainerRows } = await pool.query("SELECT user_id FROM  trainers WHERE id = $1", [workoutPlan.trainer_id])
    const trainerUserId = trainerRows[0].user_id;

    const { rows: trainerUserRows } = await pool.query("SELECT name, surname FROM  users WHERE id = $1", [trainerUserId])
    const trainerUser = trainerUserRows[0];
    //poprawić zmienione nazwy tabel i kolumn
    const { rows: workouts } = await pool.query(
        "SELECT \
        workout_plan_days.name, \
        workout_plan_days.week_day AS weekDay,\
        workout_plan_days.id,\
        workout_plans.id AS workoutPlanId \
        FROM workout_plan_days JOIN workout_plans \
        ON workout_plan_days.workout_plan_id = $1",
        [workoutPlan.id]
    );

    return response
        .status(200)
        .json({
            workoutPlan: {
                id: workoutPlan.id,
                name: workoutPlan.name,
                workouts,
                trainer: {
                    id: traineeId,
                    name: trainerUser.name,
                    surname: trainerUser.surname,
                },
            },
        });
});

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
                )\
            )\
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

export const getTraineeWorkoutPlanDay = asyncErrorHandler(async (request, response, next) => {
    const { tokenPayload } = request;
    const { id: workoutPlanDayId } = request.params;

    const { rows: traineeRows } = await pool.query("SELECT id FROM trainees WHERE user_id = $1", [tokenPayload.userId]);
    const traineeId = traineeRows[0].id;

    const { rows } = await pool.query(
        "SELECT * FROM \
        workout_plan_days JOIN workout_plans \
        ON workout_plan_days.workout_plan_id = workout_plans.id \
        WHERE workout_plans.trainee_id = $1 AND workout_plan_days.id = $2",
        [traineeId, workoutPlanDayId]
    );

    if (!rows.length) {
        const error = new CustomError("This workout does not belong to you", 403);
        return next(error);
    }

    const { rows: excersises } = await pool.query(
        "SELECT \
        excersises.id AS excersise_id, \
        excersises.name AS excersise_name, \
        workout_plan_day_excersises.sets_number AS  excersise_sets_number, \
        workout_plan_day_excersises.break_range_min_seconds AS  excersise_min_break_seconds, \
        workout_plan_day_excersises.break_range_max_seconds AS  excersise_max_break_seconds, \
        workout_plan_day_excersises.eccentric_length_seconds, \
        workout_plan_day_excersises.concentric_length_seconds, \
        workout_plan_day_excersises.eccentric_pause_length_seconds, \
        workout_plan_day_excersises.concentric_pause_length_seconds \
        FROM 	\
        workout_plan_day_excersises JOIN excersises \
        ON workout_plan_day_excersises.excersise_id = excersises.id \
        JOIN excersise_muscle_subgroups \
        ON excersises.id = excersise_muscle_subgroups.excersise_id \
        JOIN muscle_subgroups \
        ON excersise_muscle_subgroups.muscle_subgroup_id = muscle_subgroups.id \
        WHERE workout_plan_day_excersises.workout_plan_day_id = $1",
        [workoutPlanDayId]
    );

    response
        .status(200)
        .json({
            excersises
        });
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

    //co jeżeli !logExcersiseRows.length ? zwrócić błąd?

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