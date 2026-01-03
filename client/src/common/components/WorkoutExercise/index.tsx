import { useIsOpen } from "../../hooks/useIsOpen";
import { WorkoutExerciseDetails } from "../WorkoutExerciseDetails";

export const WorkoutExercise = ({ exercise }) => {
    //wynieść zarządzanie otwieraniem ćwiczeń wyżej do poziomu listy ?
    //lepsze zarządzanie, na przykład jeśli bym chciał, aby tylko konkretne elementy były otwarte na start?

    const { isOpen, setIsOpen } = useIsOpen(false);

    return (
        <div>
            <div style={{ margin: "10px" }} >
                {exercise.name}{" "}
                {exercise.sets_number}S.{" "}
                {exercise.reps_range.min}{""}
                {exercise.reps_range.max ? `-${exercise.reps_range.max}x` : ""}{" "}
                {exercise.break_range.min}
                {exercise.break_range.max ? `-${exercise.break_range.max}sec.` : ""}{" "}
                {exercise.muscle_subgroups.map(({ name }) => name).join(", ")}
            </div>
            <div
                onClick={() => {
                    setIsOpen(isOpen => !isOpen);
                }}
            >
                Details
            </div>
            {
                isOpen && (
                    <WorkoutExerciseDetails exerciseId={exercise.id} />
                )
            }
        </div>
    );
};