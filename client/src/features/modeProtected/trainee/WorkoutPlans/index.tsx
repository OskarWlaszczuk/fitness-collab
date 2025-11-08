import { Link } from "react-router-dom";
import { StyledWorkoutPlans } from "./styled";

interface WorkoutOverview {
  id: number;
  name: string,
  weekDay: string,
  excersiseAmount: number,
}

interface TrainerOverview {
  id: number;
  name: string;
}

interface StyledWorkoutPlans {
  id: number;
  trainer: TrainerOverview;
  name: string;
  workouts: WorkoutOverview[];
};


const workoutsPlans: StyledWorkoutPlans[] = [
  {
    id: 1,
    trainer: {
      id: 1,
      name: "Piotr Hajduk",
    },
    name: "PUSH-PULL-LEGS",
    workouts: [
      {
        id: 1,
        name: "PUSH",
        weekDay: "monday",
        excersiseAmount: 5,
      },
      {
        id: 2,
        name: "PULL",
        weekDay: "tuesday",
        excersiseAmount: 5,
      },
      {
        id: 3,
        name: "LEGS",
        weekDay: "wednesday",
        excersiseAmount: 5,
      },
    ],
  },
  {
    id: 2,
    trainer: {
      id: 1,
      name: "Piotr Hajduk",
    },
    name: "FBW-FBW",
    workouts: [
      {
        id: 4,
        name: "FBW",
        weekDay: "monday",
        excersiseAmount: 6,
      },
      {
        id: 5,
        name: "FBW",
        weekDay: "tuesday",
        excersiseAmount: 6,
      },
    ],
  },
];

export const WorkoutPlans = () => {

  return (
    <>
      <h1>Your Workouts</h1>
      {
        workoutsPlans.map(({ trainer, name: splitName, workouts }) => {
          return (
            <StyledWorkoutPlans key={trainer.name}>
              <header>{splitName} by <Link to={`/trainers/${trainer.id}`}>{trainer.name}</Link></header>
              <ol>
                {
                  workouts.map(({ name, weekDay, excersiseAmount: excersiseNumbers, id }) => (
                    <Link to={`/workouts/${id}`}>
                      <li key={name}>{name} ({weekDay}) {excersiseNumbers} excersises</li>
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