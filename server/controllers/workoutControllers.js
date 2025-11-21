import { pool } from "../db.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/CustomError.js";

export const getWorkout = asyncErrorHandler(async (request, response, next) => {
    const { tokenPayload } = request;
    const { id: workoutId } = request.params;

    const { rows: traineeRows } = await pool.query("SELECT id FROM trainees WHERE user_id = $1", [tokenPayload.userId]);
    const traineeId = traineeRows[0].id;

    const { rows: workoutRows } = await pool.query(
        "SELECT \
            workout_plan_days.id AS id, \
            workout_plan_days.name AS name, \
            workout_plan_days.week_day, \
            json_build_object( \
                'id', workout_plans.id,  \
                'name', workout_plans.name  \
            ) AS plan \
        FROM \
        workout_plan_days JOIN workout_plans \
        ON workout_plan_days.workout_plan_id = workout_plans.id \
        WHERE workout_plans.trainee_id = $1 AND workout_plan_days.id = $2",
        [traineeId, workoutId]
    );

    if (!workoutRows.length) {
        const error = new CustomError("This workout does not belong to you", 403);
        return next(error);
    }

    const workout = workoutRows[0];

    const { rows: excersises } = await pool.query(
        "SELECT \
            excersises.id AS id, \
            excersises.name AS name, \
            workout_plan_day_excersises.sets_number AS  sets_number, \
            json_build_object( \
                'min', workout_plan_day_excersises.break_range_min_seconds, \
                'max', workout_plan_day_excersises.break_range_max_seconds\
            ) AS break_range, \
            json_build_object( \
                'min', workout_plan_day_excersises.reps_range_min,\
                'max', workout_plan_day_excersises.reps_range_max\
            ) AS reps_range, \
            json_build_object( \
                'eccentric', workout_plan_day_excersises.eccentric_length_seconds,  \
                'concentric', workout_plan_day_excersises.concentric_length_seconds,  \
                'eccentricPause', workout_plan_day_excersises.eccentric_pause_length_seconds,  \
                'concentricPause', workout_plan_day_excersises.concentric_length_seconds  \
            ) AS pace, \
            ( \
                SELECT \
                json_agg( \
                    json_build_object( \
                        'id', muscle_subgroups.id, \
                        'name', muscle_subgroups.name \
                    ) \
                ) \
                FROM muscle_subgroups JOIN excersise_muscle_subgroups \
                ON excersise_muscle_subgroups.muscle_subgroup_id = muscle_subgroups.id \
                WHERE excersise_muscle_subgroups.excersise_id = excersises.id  \
            ) AS muscle_subgroups \
            FROM 	\
            workout_plan_day_excersises JOIN excersises \
            ON workout_plan_day_excersises.excersise_id = excersises.id \
            WHERE workout_plan_day_excersises.workout_plan_day_id = $1",
        [workoutId]
    );

    return response
        .status(200)
        .json({
            workout: { ...workout, excersises }
        });
});