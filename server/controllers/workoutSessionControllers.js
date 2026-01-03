import { pool } from "../db.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/CustomError.js";

export const startWorkoutSession = asyncErrorHandler(async (request, response, next) => {
    const { tokenPayload } = request;

    const { workoutId } = request.body;

    const { rows: traineeRows } = await pool.query("SELECT id FROM trainees WHERE user_id = $1", [tokenPayload.userId]);

    //podopieczny nie istnieje
    if (!traineeRows.length) {
        const error = new CustomError("Trainee not found", 404);
        return next(error);
    }

    const traineeId = traineeRows[0].id;

    const { rows: workoutExistsRows } = await pool.query(
        "SELECT EXISTS ( \
            SELECT 1 FROM workout_plan_days WHERE workout_plan_days.id = $1 \
        )",
        [workoutId]
    );

    if (!workoutExistsRows[0].exists) {
        const error = new CustomError("Workout not found", 404);
        return next(error);
    }

    const { rows: workoutPlanRows } = await pool.query(
        "SELECT \
        workout_plans.is_active \
        FROM workout_plans \
        JOIN workout_plan_days \
        ON workout_plans.id = workout_plan_days.workout_plan_id \
        WHERE workout_plan_days.id = $1 AND workout_plans.trainee_id = $2",
        [workoutId, traineeId]
    );

    //plan nie istnieje lub nie należy do podopiecznego
    if (!workoutPlanRows.length) {
        const error = new CustomError("This workout plan does not exist or do not belong to this trainee", 403);
        return next(error);
    }

    const isWorkoutPlanActive = workoutPlanRows[0].is_active;

    // plan nie jest aktywny
    if (!isWorkoutPlanActive) {
        const error = new CustomError("This workout plan is not active", 400);
        return next(error);
    }

    const { rows: workoutSessionExistsRows } = await pool.query(
        "SELECT EXISTS ( \
            SELECT  \
                1  \
            FROM trainee_workout_sessions \
            WHERE trainee_workout_sessions.trainee_id = $1 AND workout_session_status_id = 1 \
        )",
        [traineeId]
    )

    if (workoutSessionExistsRows[0].exists) {
        const error = new CustomError("There is already an active workout session", 400);
        return next(error);
    }

    const { rows: workoutSessionRows } = await pool.query(
        "INSERT INTO trainee_workout_sessions \
        (trainee_id, workout_plan_day_id, workout_session_status_id) \
        VALUES ($1, $2, $3) \
        RETURNING id",
        [traineeId, workoutId, 1]
    );

    const workoutSession = workoutSessionRows[0];

    return response.status(201).json({ workoutSession });
});

export const completeWorkoutSession = asyncErrorHandler(async (request, response, next) => {
    const { tokenPayload } = request;
    const { sessionId } = request.body;

    const { rows: traineeRows } = await pool.query("SELECT id FROM trainees WHERE user_id = $1", [tokenPayload.userId]);

    const traineeId = traineeRows[0].id;

    const { rows: workoutSessionRows } = await pool.query(
        "UPDATE trainee_workout_sessions \
        SET workout_session_status_id = $1 \
        WHERE \
            id = $2 AND \
            trainee_id = $3 \
        RETURNING id",
        [2, sessionId, traineeId]
    );

    if (!workoutSessionRows.length) {
        const error = new CustomError("Workout session not found or does not belong to this trainee", 404);
        return next(error);
    }

    const updatedWorkoutSession = workoutSessionRows[0];

    return response.status(201).json({ session: updatedWorkoutSession });
});