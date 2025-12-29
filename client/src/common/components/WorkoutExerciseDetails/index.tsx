import { ExerciseSets } from "./ExerciseSets/index.tsx";

interface WorkoutExerciseProps {
    exerciseId: number;
}

export const WorkoutExerciseDetails = ({ exerciseId }: WorkoutExerciseProps) => {
    return (
        <section
            style={{
                backgroundColor: "#E4E6F0",
                padding: "10px",
                margin: "8px 0"
            }}
        >
            <ExerciseSets exerciseId={exerciseId} />
        </section>
    );
};
