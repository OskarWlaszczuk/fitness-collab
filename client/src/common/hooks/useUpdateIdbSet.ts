import { useMutation } from "@tanstack/react-query";
import { updateExercisSet } from "../../features/modeProtected/trainee/Workout/indexedDb";

export const useUpdateIdbSetMutation = () => {

    const updateIdbSetMutation = useMutation({
        mutationFn: async (set) => {
            const updatedSet = await updateExercisSet(set);

            return updatedSet;
        },
    });

    return updateIdbSetMutation;
};