import { pool } from "../db.js";
import { saveExcersiseEntry } from "../services/saveExcersiseEntry.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/CustomError.js";

export const addEntry = asyncErrorHandler(async (request, response, next) => {
    const { tokenPayload } = request;

    //dodać walidacje danych wejściowych
    const {
        exerciseId,
        workoutId,
        sets,
        workoutSessionId
    } = request.body;

    const { rows: traineeRows } = await pool.query("SELECT id FROM trainees WHERE user_id = $1", [tokenPayload.userId]);

    //podopieczny nie istnieje
    if (!traineeRows.length) {
        const error = new CustomError("Trainee not found", 404);
        return next(error);
    }

    const traineeId = traineeRows[0].id;

    const { rows: excersiseExistsRows } = await pool.query(
        "SELECT EXISTS (SELECT 1 FROM excersises WHERE id = $1) AS excersise_exists",
        [exerciseId]
    );

    console.log(excersiseExistsRows);

    const isExerciseExists = excersiseExistsRows[0].excersise_exists;

    //ćwiczenie nie istnieje
    if (!isExerciseExists) {
        const error = new CustomError("Excersise not found", 404);
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

    const { rows: workoutSessionRows } = await pool.query(
        "SELECT \
            workout_session_statuses.name \
        FROM trainee_workout_sessions \
        JOIN workout_session_statuses \
        ON trainee_workout_sessions.workout_session_status_id = workout_session_statuses.id \
		WHERE trainee_workout_sessions.id = $1 AND trainee_workout_sessions.workout_plan_day_id = $2 AND trainee_id = $3",
        [workoutSessionId, workoutId, traineeId]
    );

    //podopieczny nie rozpoczął jeszcze sesji treningowej
    if (!workoutSessionRows.length) {
        const error = new CustomError("This session does not exist or does not belong to this trainee", 400);
        return next(error);
    }

    const isWorkoutSessionActive = workoutSessionRows[0].name === "active";

    //sesja treningowa nie jest aktywna
    if (!isWorkoutSessionActive) {
        const error = new CustomError("This workout's session is not active", 400);
        return next(error);
    }

    const { rows: workoutExerciseRows } = await pool.query(
        "SELECT EXISTS ( \
            SELECT \
                1 \
            FROM workout_plan_day_excersises \
            WHERE workout_plan_day_excersises.excersise_id = $1 AND workout_plan_day_id = $2\
        ) AS exercise_exists_in_workout",
        [exerciseId, workoutId]
    );

    const isExerciseInWorkout = workoutExerciseRows[0].exercise_exists_in_workout;
    //ćwiczenie nie należy do treningu w planie
    if (!isExerciseInWorkout) {
        const error = new CustomError("Cannot add entry to this exercise because it is not added to the active workout", 400);
        return next(error);
    }

    const insertedSets = await saveExcersiseEntry({ exerciseId, traineeId, sets, workoutId });

    return response.status(201).json({ sets: insertedSets });
});