import { pool } from "../db.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";

export const getTraineeWorkout = asyncErrorHandler(async (request, response, next) => {
    const { tokenPayload } = request;
    const { id } = request.params;

    const { rows: traineeRows } = await pool.query("SELECT id FROM trainees WHERE user_id = $1", [tokenPayload.userId]);
    const traineeId = traineeRows[0].id;

    const { rows: workoutPlanRows } = await pool.query("SELECT * FROM workout_plan WHERE trainee_id = $1 AND id = $2", [traineeId, id]);

    const workoutPlan = workoutPlanRows[0];

    const { rows: trainerRows } = await pool.query("SELECT user_id FROM  trainers WHERE id = $1", [workoutPlan.trainer_id])
    const trainerUserId = trainerRows[0].user_id;

    const { rows: trainerUserRows } = await pool.query("SELECT name, surname FROM  users WHERE id = $1", [trainerUserId])
    const trainerUser = trainerUserRows[0];

    const { rows: workouts } = await pool.query(
        "SELECT \
        workout_plan_day.name, \
        workout_plan_day.week_day AS weekDay,\
        workout_plan_day.id,\
        workout_plan.id AS workoutPlanId, \
        workout_plan_day.total_excersise AS totalExcersise \
        FROM workout_plan_day JOIN workout_plan \
        ON workout_plan_day.workout_plan_id = $1",
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

export const getTraineeWorkouts = asyncErrorHandler(async (request, response, next) => {
    const { tokenPayload } = request;

    const { rows: traineeRows } = await pool.query("SELECT id FROM trainees WHERE user_id = $1", [tokenPayload.userId]);
    const trainee = traineeRows[0];

    const { rows: workoutPlans } = await pool.query(
        "SELECT \
        workout_plan.id AS workout_plan_id, \
        workout_plan.name AS workout_plan_name,\
        json_build_object( \
            'id', trainers.id, \
            'name', users.name,\
            'surname', users.surname\
        ) AS trainer, \
        (\
            SELECT json_agg(\
                json_build_object(\
                    'id', workout_plan_day.id,\
                    'name', workout_plan_day.name,\
                    'weekDay', workout_plan_day.week_day,\
                    'totalExcersise', workout_plan_day.total_excersise,\
                    'planId', workout_plan_day.workout_plan_id\
                )\
            )\
            FROM workout_plan_day \
        WHERE workout_plan.id = workout_plan_day .workout_plan_id \
        ) AS workouts\
        FROM workout_plan \
        JOIN trainers  ON trainers.id = workout_plan.trainer_id\
        JOIN users  ON users.id = trainers.user_id\
        WHERE workout_plan.trainee_id = $1",
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