import { pool } from "../db.js";
import { saveExcersiseEntry } from "../services/saveExcersiseEntry.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/CustomError.js";

export const addEntry = asyncErrorHandler(async (request, response, next) => {
    const { tokenPayload } = request;

    //walidacja danych wejściowych
    const {
        excersiseId,
        workoutId,
        sets
    } = request.body;

    const { rows: traineeRows } = await pool.query("SELECT id FROM trainees WHERE user_id = $1", [tokenPayload.userId]);

    const traineeId = traineeRows[0].id;

    const { rows: workoutPlanRows } = await pool.query(
        "SELECT \
        workout_plans.is_active \
        FROM workout_plans \
        JOIN workout_plan_days \
        ON workout_plans.id = workout_plan_days.workout_plan_id \
        WHERE workout_plan_days.id = $1 AND workout_plans.trainee_id = $2",
        [workoutId, traineeId]
    );

    if (!workoutPlanRows.length) {
        const error = new CustomError("This workout plan does exist or do not belong to this trainee", 403);
        next(error);
    }

    const workoutPlan = workoutPlanRows[0];

    if (!workoutPlan.is_active) {
        const error = new CustomError("This workout plan is not active", 400);
        next(error);
    }

    const { rows: workoutSessionRows } = await pool.query(
        "SELECT \
        workout_session_statuses.name \
        FROM trainee_workout_sessions \
        JOIN workout_session_statuses \
        ON trainee_workout_sessions.workout_session_status_id = workout_session_statuses.id \
        WHERE trainee_workout_sessions.workout_plan_day_id = $1",
        [workoutId]
    );

    const workoutSession = workoutSessionRows?.[0];

    if (!workoutSession && workoutSession.name !== "active") {
        const error = new CustomError("This workout's session is not active", 400);
        next(error);
    }

    const { rows: workoutPlanExcersiseRows } = await pool.query(
        "SELECT \
        1\
        FROM workout_plan_day_excersises \
        WHERE workout_plan_day_excersises.excersise_id = $1 \
        AND workout_plan_day_id = $2" ,
        [excersiseId, workoutId]
    );

    if (!workoutPlanExcersiseRows.length) {
        const error = new CustomError("Cannot add entry to this excersise because it is not added to the active workout plan", 400);
        next(error);
    }

    await saveExcersiseEntry({ exerciseId: excersiseId, traineeId, sets, workoutId: workoutId });

    return response.sendStatus(201);
});