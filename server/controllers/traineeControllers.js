import { pool } from "../db.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";

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