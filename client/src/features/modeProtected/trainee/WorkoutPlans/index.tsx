import { Link } from "react-router-dom";
import { StyledWorkoutPlans } from "./styled";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "../../../../apiClients";

export const WorkoutPlans = () => {
  const fetchWorkoutPlans = async () => {
    const response = await userApi.get("/trainee/workout-plans");
    return response.data.workoutPlans;
  };

  const {
    data: workoutPlans,
  } = useQuery({
    //czy dodać tu id użytkownika?
    queryKey: ["trainee", "workoutPlans"],
    queryFn: fetchWorkoutPlans,
  });

  return (
    <>
      <h1>Your Workouts</h1>
      {
        workoutPlans?.map(({ id, name, trainer, workouts }) => {
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