import { useParams } from "react-router-dom";
import { useWorkoutQuery } from "../../../../common/hooks/useWorkoutQuery";
import { WorkoutExercise } from "../../../../common/components/WorkoutExercise";

export const Workout = () => {
    const { id: workoutId } = useParams();
    const workoutQuery = useWorkoutQuery(workoutId);

    //wynieść odpowiedzialność zarządzania widokiem na podstawie statusu poza komponent
    if (!workoutQuery.isSuccess) return <>Workout is not available yet</>;

    const { exercises, name, week_day, plan } = workoutQuery.data;

    return (
        <>
            <header>{name} ({week_day}) of {plan.name}</header>
            <section>
                <ol>
                    {
                        exercises.map(exercise => (
                            <li>
                                <WorkoutExercise exercise={exercise} />
                            </li>
                        ))
                    }
                </ol>
            </section>
        </>
    );
};