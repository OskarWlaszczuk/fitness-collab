import { useQuery } from "@tanstack/react-query";
import { fetchFromApi } from "../functions/fetchFromApi";

//odpowiedzialność hooka - pobranie planu treningowego na podstawie jego id
export const useWorkoutQuery = (workoutId) => {
    const fetchWorkout = async () => {
        const response = await fetchFromApi(`/workout/${workoutId}`);
        return response.workout;
    };

    const workoutQuery = useQuery({
        queryKey: ["workout", workoutId],
        queryFn: fetchWorkout,
    });

    return workoutQuery;
};