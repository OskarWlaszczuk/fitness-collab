import { useState } from "react";
import { WorkoutPlanDayExcersise } from "./WorkoutPlanDayExcersise";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "../../../../apiClients";
import { useParams } from "react-router-dom";

// type MuscleGroups = string;
// type PaceValue = number;


// export interface ExcersiseRepPace {
//     eccentric: PaceValue,
//     concentric: PaceValue,
//     eccentricPause: PaceValue,
//     concentricPause: PaceValue,
// }

// interface WorkoutExcersiseOverview {
//     id: number;
//     order: number;
//     name: string;
//     sets: number;
//     repsRange: {
//         min: number;
//         max?: number;
//     };
//     pace: ExcersiseRepPace,
//     breakRange: {
//         min: number;
//         max?: number;
//     };
//     muscleGroups: MuscleGroups[];
// }

export const WorkoutPlanDay = () => {
    const { id: workoutId } = useParams();
    const [openedDetails, setOpenedDetails] = useState<number[]>([]);
    console.log(openedDetails);

    const isExcersiseOpened = (excersiseId: number) => openedDetails.includes(excersiseId);

    const fetchWorkout = async () => {
        const response = await userApi.get(`/trainee/workout-plan-day/${workoutId}`);
        return response.data.workout;
    };

    const {
        data: workout
    } = useQuery({
        //czy dodać tu id użytkownika?
        queryKey: ["workout", workoutId, "excersises"],
        queryFn: fetchWorkout,
    });

    if (!workout) return <></>;

    return (
        <>
            <header>{workout.name} ({workout.week_day}) of {workout.plan.name}</header>
            <section>
                <ol>
                    {
                        workout.excersises.map(({
                            id,
                            name,
                            break_range,
                            muscle_subgroups,
                            pace,
                            reps_range,
                            sets_number,
                        }) => {
                            return (
                                <div key={name}>
                                    <li style={{ margin: "10px" }} >
                                        {name}{" "}
                                        {sets_number}S.{" "}
                                        {reps_range.min}{""}
                                        {reps_range.max ? `-${reps_range.max}x` : ""}{" "}
                                        {break_range.min}
                                        {break_range.max ? `-${break_range.max}sec.` : ""}{" "}
                                        {muscle_subgroups.map(({ name }) => name).join(", ")}
                                    </li>
                                    <button onClick={() => {
                                        return isExcersiseOpened(id) ?
                                            setOpenedDetails(openedDetails => [...openedDetails.filter(excersiseId => excersiseId !== id)]) :
                                            setOpenedDetails(openedDetails => [...openedDetails, id])
                                    }}>
                                        Show   {isExcersiseOpened(id) ? "less" : "more"}
                                    </button>
                                    {
                                        isExcersiseOpened(id) && (
                                            <WorkoutPlanDayExcersise />
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </ol>
            </section>
        </>
    )
};
//•