import { pool } from "../db.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";

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
        workout_plans.id AS workoutPlanId, \
        FROM workout_plan_days JOIN workout_plans \
        ON workout_plan_days.workout_plan_id = $1",
        //warunek WHERE?
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
//prostsze nazwy
export const getTraineeWorkoutPlans = asyncErrorHandler(async (request, response, next) => {
    const { tokenPayload } = request;

    const { rows: traineeRows } = await pool.query("SELECT id FROM trainees WHERE user_id = $1", [tokenPayload.userId]);
    const trainee = traineeRows[0];

    const { rows: workoutPlans } = await pool.query(
        "SELECT \
        workout_plans.id AS workout_plan_id, \
        workout_plans.name AS workout_plan_name,\
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
                    'planId', workout_plan_days.workout_plan_id\
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

// export const getWorkout

export const getWorkout = asyncErrorHandler(async (request, response, next) => {
    const { tokenPayload } = request;
    const { id } = request.params;



    //pobieranie danych z tabeli trainee


    response.status(200).json({
        id,
        name,
        weekDay,
        plan: {
            id,
            name
        },
        excersises: [

        ]
    });
});