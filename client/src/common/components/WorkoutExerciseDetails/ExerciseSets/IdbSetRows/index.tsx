import { useQueryClient } from "@tanstack/react-query";
import { useExerciseIdbSetsQuery, type IdbSet } from "../../../../hooks/useExerciseIdbSetsQuery";
import { ExerciseSetRow } from "../../../ExerciseSetRow";
// import { useAddNewIdbSetMutation } from "../../../../hooks/useSaveIDBSet";
// import { useUpdateIdbSetMutation } from "../../../../hooks/useUpdateIDBSet";

export const IdbSetRows = ({ exerciseId, setFieldsConfig }) => {
    const queryClient = useQueryClient();
    const exerciseIdbSetsQuery = useExerciseIdbSetsQuery(exerciseId);
    // const addNewIdbSetMutation = useAddNewIdbSetMutation();
    // const updateIdbSetMutation = useUpdateIdbSetMutation();

    const updateIdbSet = (set) => {
        queryClient.setQueryData(
            ["idb", "exerciseSets", exerciseId],
            (sets: IdbSet[]) => (
                [
                    ...sets.filter(({ id }) => id !== set.id),
                    set
                ]
            )
        );
    };

    const deleteIdbSet = (set) => {
        queryClient.setQueryData(
            ["idb", "exerciseSets", exerciseId],
            (sets: IdbSet[]) => (
                [
                    ...sets.filter(({ id }) => id !== set.id),
                ]
            )
        );
    };

    const onIdbSetChange = (updatedSet) => {
        console.log(`set ${updatedSet.id} zmienił`);
        const isSetCompleted = Object.values(updatedSet).every(field => !!field);

        if (isSetCompleted) {
            console.log(`set completed`);
        }
    };

    if (!exerciseIdbSetsQuery.data) {
        return <>loading...</>
    }

    return (
        <>
            {
                exerciseIdbSetsQuery.data
                    .sort((a, b) => a.id - b.id)
                    .map(set => (
                        <>
                            <ExerciseSetRow
                                onSetChange={onIdbSetChange}
                                set={set}
                                setFieldsConfig={setFieldsConfig}
                                onFieldChange={({ target }) => {
                                    const changedField = target.name;
                                    const newFieldValue = target.value;
                                    //update stanu widoku
                                    const updatedSet = { ...set, [changedField]: newFieldValue, hasChanged: true };
                                    updateIdbSet(updatedSet);
                                }}
                            />
                            <button
                                onClick={() => {
                                    deleteIdbSet(set);
                                    //usunięcie serii w IDB
                                }}
                            >
                                delete
                            </button>
                        </>
                    ))
            }
        </>
    );
};