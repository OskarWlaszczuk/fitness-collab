import { useQuery } from "@tanstack/react-query";
import { api } from "../../apiClients";

export const useWorkoutPlanQuery = () => {
    const fetchWorkoutPlans = async () => {
        const response = await api.get("/trainee/workout-plans");
        return response.data.workoutPlans;
    };

    const workoutPlansQuery = useQuery({
        //czy dodać tu id użytkownika?
        queryKey: ["trainee", "workoutPlans"],
        queryFn: fetchWorkoutPlans,
    });

    return workoutPlansQuery;
};