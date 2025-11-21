import { pool } from "../db.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";

export const getWorkoutPlan = asyncErrorHandler(async (request, response, next) => {
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