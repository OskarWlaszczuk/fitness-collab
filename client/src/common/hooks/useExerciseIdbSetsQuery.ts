import { useQuery } from "@tanstack/react-query";

import { getExerciseSets } from "../../features/modeProtected/trainee/WorkoutPlanDay/indexedDb";

//pobieranie wszystkich serii z idb na podstawie exerciseId
export const useExerciseIdbSetsQuery = (exerciseId: number) => {

    const fetchExerciseIdbSets = async () => {
        const exerciseIdbSets = await getExerciseSets(exerciseId);
        console.log(exerciseIdbSets);

        return exerciseIdbSets;
    };

    const { data: idbSets, status, error } = useQuery({
        queryKey: ["idb", "sets", exerciseId],
        queryFn: fetchExerciseIdbSets,
        // staleTime: refreshTimeMin,
        // gcTime: refreshTimeMin,
        // refetchInterval: refreshTimeMin,
        retry: 1,
    });
    console.log(status,error);

    return { idbSets };
};