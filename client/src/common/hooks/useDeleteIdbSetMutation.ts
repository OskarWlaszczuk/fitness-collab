import { useMutation } from "@tanstack/react-query";
import { deleteExerciseSet } from "../../features/modeProtected/trainee/Workout/indexedDb";

export const useDeleteIdbSetMutation = () => {
    const deleteIdbSet = async (setId) => {
        await deleteExerciseSet(setId);

        return setId;
    };

    const deleteIdbSetMutation = useMutation({
        mutationFn: deleteIdbSet,
    });

    return deleteIdbSetMutation;
};