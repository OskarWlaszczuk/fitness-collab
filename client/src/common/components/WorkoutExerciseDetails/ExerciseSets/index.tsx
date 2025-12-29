import { useEffect, useState } from "react";
import { useExerciseIdbSetsQuery, type IdbSet } from "../../../hooks/useExerciseIdbSetsQuery";
import { useAddNewIdbSetMutation } from "../../../hooks/useSaveIDBSet";
import { useUpdateIdbSetMutation } from "../../../hooks/useUpdateIDBSet";
import type { Set } from "../../../types/Set";
import { useQueryClient } from "@tanstack/react-query";
import { ExerciseSetRow } from "./ExerciseSetRow";

interface ExerciseSetsProps {
    exerciseId: number;
}

const defaultDraftSet: Set = {
    weightKg: undefined,
    reps: undefined,
    rir: undefined,
};

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

export const ExerciseSets = ({ exerciseId }: ExerciseSetsProps) => {

    //na którym etapie i jak dobierać konfigurację wiersza serii?
    //jedna konfiguracja przynależy do wszystkich wierszy danego ćwiczenia
    //każde ćwiczenie ma przypisany typ konfiguracji serii (pomiaru progresu) zapisane w db
    const setFieldsConfig = [
        {
            name: "reps",
            type: "number",
            label: "x",
        },
        {
            name: "weightKg",
            type: "number",
            label: "kg",
        },
        {
            name: "rir",
            type: "number",
            label: "RiR",
        },
    ];

    const [draftSet, setDraftSet] = useState<Set | undefined>(defaultDraftSet);
    const queryClient = useQueryClient();
    const addNewIdbSetMutation = useAddNewIdbSetMutation();
    const updateIdbSetMutation = useUpdateIdbSetMutation();

    const exerciseIdbSetsQuery = useExerciseIdbSetsQuery(exerciseId);
    const idbSets = exerciseIdbSetsQuery.data;

    if (!idbSets) return <>waiting for idbSets...</>;

    return (
        <>
            <button
                disabled={
                    addNewIdbSetMutation.isPending ||
                    !!draftSet ||
                    [...idbSets || [], draftSet || {}].some(set => Object.values(set).some(value => !value)) ||
                    updateIdbSetMutation.isPending
                }
                onClick={() => {
                    setDraftSet(defaultDraftSet);
                }}
            >
                Add set
            </button><br />
            {
                idbSets
                    .map(set => (
                        <ExerciseSetRow
                            set={set}
                            setFieldsConfig={setFieldsConfig}
                            onFieldChange={({ target }) => {
                                const name = target.name;
                                const value = target.value;

                                queryClient.setQueryData(
                                    ["idb", "sets", exerciseId],
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
                    ))
            }
            {
                draftSet && (
                    <ExerciseSetRow
                        set={draftSet}
                        setFieldsConfig={setFieldsConfig}
                        onFieldChange={({ target }) => {
                            const fieldName = target.name;
                            const fieldValue = target.value;

                            setDraftSet(set => ({ ...set!, [fieldName]: fieldValue }));
                        }}
                    />
                )
            }
        </>
    );
};