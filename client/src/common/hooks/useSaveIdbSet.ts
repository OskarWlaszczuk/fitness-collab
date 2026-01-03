import { useMutation } from "@tanstack/react-query";
import type { Set } from "../types/Set";
import { addNewExerciseSet } from "../../features/modeProtected/trainee/Workout/indexedDb";

//zapisywanie pojedynczej serii lokalnie w indexedDB
export const useSaveIdbSetMutation = () => {

    const addNewIdbSetMutation = useMutation({
        mutationFn: async ({ set, exerciseId }: { set: Set, exerciseId: number }) => {
            const addedSet = await addNewExerciseSet(exerciseId, set);
            console.log("new set added to IDB:", addedSet);

            return { set: addedSet, exerciseId };
        },
    });

    return addNewIdbSetMutation;
};