import { useQuery } from "@tanstack/react-query";
import { getExerciseSets } from "../../features/modeProtected/trainee/Workout/indexedDb";

//pobieranie wszystkich serii z idb na podstawie exerciseId
export const useExerciseIdbSetsQuery = (exerciseId: number) => {

    const fetchExerciseIdbSets = async () => {
        const exerciseIdbSets = await getExerciseSets(exerciseId);

        return exerciseIdbSets;
    };

    const exerciseIdbSetsQuery = useQuery({
        queryKey: ["idb", "exerciseSets", exerciseId],
        queryFn: fetchExerciseIdbSets,
        retry: 1,
    });

    return exerciseIdbSetsQuery;
};