import { useQueryClient } from "@tanstack/react-query";
import { useExerciseIdbSetsQuery, type IdbSet } from "../../../../hooks/useExerciseIdbSetsQuery";
import { ExerciseSetRow } from "../../../ExerciseSetRow";
import { useAddNewIdbSetMutation } from "../../../../hooks/useSaveIDBSet";
import { useUpdateIdbSetMutation } from "../../../../hooks/useUpdateIDBSet";

// const useSaveDraftSet = ({ draftSet, setDraftSet, exerciseId }) => {
//     useEffect(() => {
//         //sprawdzenie, czy wszystkie pola draft set zostały uzupełnione - zapis nowej serii IDB
//         if (draftSet && Object.values(draftSet).every(value => value)) {
//             console.log("Saving new completed set", draftSet);
//             addNewIdbSetMutation.mutate({ set: draftSet, exerciseId });

//             if (addNewIdbSetMutation.isSuccess) {
//                 console.log('draft zapisany');
//             }
//             //wywołać saveIdbSet, zapisać draft set w idb, dodać od razu do query idb sets, aby zaktualizować widok i ustawić stan draftSet, jako undefined
//         }
//     }, [draftSet, exerciseId, addNewIdbSetMutation, setDraftSet]);
// }

// export const useUpdateIdbSet = ({ exerciseId, idbSets }) => {
//     useEffect(() => {
//         //sprawdzenie, czy któryś z zapisanych serii IDB został edytowany
//         if (idbSets && idbSets.length) {
//             idbSets.forEach(set => {
//                 //sprawdzenie, czy wszystkie pola edytowanego obiektu są uzupełnione
//                 if (Object.values(set).every(value => value) && set.hasChanged) {
//                     console.log("Update serii", set);

//                     // updateIdbSetMutation.mutate(set);
//                 }
//             })
//         }
//     }, [idbSets]);
// };

export const IdbSetRows = ({ exerciseId, setFieldsConfig }) => {
    const queryClient = useQueryClient();
    const exerciseIdbSetsQuery = useExerciseIdbSetsQuery(exerciseId);
    // const addNewIdbSetMutation = useAddNewIdbSetMutation();
    // const updateIdbSetMutation = useUpdateIdbSetMutation();

    return (
        <>
            {
                exerciseIdbSetsQuery.data
                    ?.map(set => (
                        <>
                            <ExerciseSetRow
                                set={set}
                                setFieldsConfig={setFieldsConfig}
                                onFieldChange={({ target }) => {
                                    const name = target.name;
                                    const value = target.value;
                                    //zmieniając sam stan po edycji pola, nie zmieniam stale danych w indexedDB!
                                    queryClient.setQueryData(
                                        ["idb", "exerciseSets", exerciseId],
                                        (sets: IdbSet[]) => (
                                            sets && sets.length ?
                                                [
                                                    ...sets.filter(({ id }) => id !== set.id),
                                                    {
                                                        ...set,
                                                        [name]: value,
                                                        hasChanged: true,
                                                    }
                                                ] :
                                                sets
                                        )
                                    );
                                }}
                            />
                            <button
                                onClick={() => {
                                    //wywołanie mutacji, która usunie serię z idb
                                    //muszę
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