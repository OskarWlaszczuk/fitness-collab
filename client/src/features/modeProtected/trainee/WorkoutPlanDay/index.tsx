import { useState } from "react";
import { WorkoutPlanDayExcersise } from "./WorkoutPlanDayExcersise";

type MuscleGroups = string;
type PaceValue = number;


export interface ExcersiseRepPace {
    eccentric: PaceValue,
    concentric: PaceValue,
    eccentricPause: PaceValue,
    concentricPause: PaceValue,
}

interface WorkoutExcersiseOverview {
    id: number;
    order: number;
    name: string;
    sets: number;
    repsRange: {
        min: number;
        max?: number;
    };
    pace: ExcersiseRepPace,
    breakRange: {
        min: number;
        max?: number;
    };
    muscleGroups: MuscleGroups[];
}

const workoutExercises: WorkoutExcersiseOverview[] = [
    {
        id: 1,
        order: 1,
        name: "Barbell Squat",
        sets: 4,
        repsRange: { min: 6, max: 8 },
        pace: { eccentric: 3, concentric: 1, eccentricPause: 0, concentricPause: 1 },
        breakRange: { min: 90, max: 120 },
        muscleGroups: ["quadriceps", "glutes", "hamstrings", "core"]
    },
    {
        id: 2,
        order: 2,
        name: "Romanian Deadlift",
        sets: 3,
        repsRange: { min: 8, max: 10 },
        pace: { eccentric: 3, concentric: 1, eccentricPause: 0, concentricPause: 0 },
        breakRange: { min: 90, max: 120 },
        muscleGroups: ["hamstrings", "glutes", "lower back"]
    },
    {
        id: 3,
        order: 3,
        name: "Dumbbell Bench Press",
        sets: 4,
        repsRange: { min: 8, max: 10 },
        pace: { eccentric: 2, concentric: 1, eccentricPause: 0, concentricPause: 1 },
        breakRange: { min: 60, max: 90 },
        muscleGroups: ["chest", "triceps", "front delts"]
    },
    {
        id: 4,
        order: 4,
        name: "Pull-Up",
        sets: 4,
        repsRange: { min: 6, max: 10 },
        pace: { eccentric: 3, concentric: 1, eccentricPause: 0, concentricPause: 1 },
        breakRange: { min: 90 },
        muscleGroups: ["lats", "biceps", "rear delts", "core"]
    },
    {
        id: 5,
        order: 5,
        name: "Seated Dumbbell Shoulder Press",
        sets: 3,
        repsRange: { min: 10, max: 12 },
        pace: { eccentric: 2, concentric: 1, eccentricPause: 0, concentricPause: 1 },
        breakRange: { min: 60, max: 90 },
        muscleGroups: ["shoulders", "triceps"]
    },
];

const workout = {
    id: 1,
    name: "PUSH",
    weekDay: "monday",
};

export const WorkoutPlanDay = () => {
    // const { id } = useParams();
    const [openedDetails, setOpenedDetails] = useState<number[]>([]);
    console.log(openedDetails);

    const isExcersiseOpened = (excersiseId: number) => openedDetails.includes(excersiseId);

    return (
        <>
            <header>{workout.name} ({workout.weekDay})</header>
            <section>
                <ol>
                    {
                        workoutExercises.map(({
                            id,
                            name,
                            // order,
                            sets,
                            repsRange,
                            // pace,
                            breakRange,
                            muscleGroups
                        }) => {
                            return (
                                <div key={name}>
                                    <li style={{ margin: "10px" }} >
                                        {name}{" "}
                                        {sets}S.{" "}
                                        {repsRange.min}{""}
                                        {repsRange.max ? `-${repsRange.max}x` : ""}{" "}
                                        {breakRange.min}
                                        {breakRange.max ? `-${breakRange.max}sec.` : ""}{" "}
                                        {muscleGroups.join(", ")}
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