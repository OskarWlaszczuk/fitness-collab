import { Link } from "react-router-dom";
import { StyledWorkoutPlans } from "./styled";
import { useWorkoutPlanQuery } from "../../../../common/hooks/useWorkoutPlanQuery";

export const WorkoutPlans = () => {
  const workoutPlansQuery = useWorkoutPlanQuery();

  if (!workoutPlansQuery.isSuccess) return <>loading...</>;

  const workoutPlans = workoutPlansQuery.data;

  return (
    <>
      <h1>Your Workouts</h1>
      {
        workoutPlans.map(({ id, name, trainer, workouts }) => {
          return (
            <StyledWorkoutPlans key={`${name} ${id}`}>
              <header>{name} by <Link to={`/trainers/${trainer.id}`}>{trainer.name} {trainer.surname}</Link></header>
              <ol>
                {
                  workouts.map(({ id, name, weekDay }) => (
                    <Link key={`${name} ${id}`} to={`/workout-plan-day/${id}`}>
                      <li key={name}>{name} ({weekDay})</li>
                    </Link>
                  ))
                }
              </ol>
            </StyledWorkoutPlans>
          )
        })
      }
    </>
  );
};