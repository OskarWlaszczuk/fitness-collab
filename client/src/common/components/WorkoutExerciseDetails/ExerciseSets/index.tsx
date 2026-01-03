import { useEffect, useState } from "react";
import type { Set } from "../../../types/Set";
import { ExerciseSetRow } from "../../ExerciseSetRow";
import { useExerciseIdbSetsQuery } from "../../../hooks/useExerciseIdbSetsQuery";
import { useSaveIdbSetMutation } from "../../../hooks/useSaveIdbSet";
import { useDeleteIdbSetMutation } from "../../../hooks/useDeleteIdbSetMutation";
import { useUpdateIdbSetMutation } from "../../../hooks/useUpdateIdbSet.ts";
import { useQueryClient } from "@tanstack/react-query";

interface ExerciseSetsProps {
    exerciseId: number;
}

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

export const ExerciseSets = ({ exerciseId }: ExerciseSetsProps) => {
    const queryClient = useQueryClient();

    const exerciseIdbSetsQuery = useExerciseIdbSetsQuery(exerciseId);
    const addNewIdbSetMutation = useSaveIdbSetMutation();
    const updateIdbSetMutation = useUpdateIdbSetMutation();
    const deleteIdbSetMutation = useDeleteIdbSetMutation(exerciseId);
    const [draftSet, setDraftSet] = useState({
        weightKg: undefined,
        reps: undefined,
        rir: undefined,
    });

    const onIdbSetComplete = (completedSet) => {
        updateIdbSetMutation.mutate(
            completedSet,
            {
                onSuccess: (updatedSet) => {
                    queryClient.setQueryData(
                        ["idb", "exerciseSets", exerciseId],
                        (sets) => [
                            ...sets.filter(({ id }) => id !== updatedSet.id) || [],
                            updatedSet
                        ]
                    );
                },
            }
        );
    };

    const onDraftSetComplete = (completedSet) => {
        addNewIdbSetMutation.mutate(
            { set: completedSet, exerciseId },
            {
                onSuccess: ({ set, exerciseId }) => {
                    queryClient.setQueryData(
                        ["idb", "exerciseSets", exerciseId],
                        (sets) => ([
                            ...sets,
                            set,
                        ])
                    );
                },
            }
        );
    };

    const idbSets = exerciseIdbSetsQuery.data;

    useEffect(() => {
        if (addNewIdbSetMutation.isSuccess) {
            setDraftSet(undefined);
        }
    }, [addNewIdbSetMutation.isSuccess]);



    return (
        <>
            <button
                disabled={!!draftSet}
                onClick={() => {
                    setDraftSet({
                        weightKg: undefined,
                        reps: undefined,
                        rir: undefined,
                    })
                }}
            >
                Add set
            </button><br />
            <ol type="I">
                {
                    idbSets
                        ?.sort((a, b) => a.id - b.id)
                        .map((set) => (
                            <li>
                                <ExerciseSetRow
                                    onSetComplete={onIdbSetComplete}
                                    set={set}
                                    setFieldsConfig={setFieldsConfig}
                                    onFieldChange={({ target }) => {
                                        const changedField = target.name;
                                        const newFieldValue = target.value;
                                        //update stanu widoku
                                        const updatedSet = { ...set, [changedField]: newFieldValue };
                                        queryClient.setQueryData(
                                            ["idb", "exerciseSets", exerciseId],
                                            (sets) => [
                                                ...sets.filter(({ id }) => id !== updatedSet.id) || [],
                                                updatedSet
                                            ]
                                        );
                                    }}
                                    isSetDisabled={updateIdbSetMutation.isPending}
                                />
                                <button
                                    onClick={() => {
                                        deleteIdbSetMutation.mutate(
                                            set.id,
                                            {
                                                onSuccess: (setId) => {
                                                    queryClient.setQueryData(
                                                        ["idb", "exerciseSets", exerciseId],
                                                        (sets) => (
                                                            [...sets || []].filter(({ id }) => id !== setId)
                                                        )
                                                    );
                                                }
                                            }
                                        );
                                    }}
                                >
                                    delete
                                </button>
                                {
                                    (set.id === addNewIdbSetMutation.data?.set.id) && (
                                        <p>Set saved</p>
                                    )
                                }
                                {
                                    (set.id === updateIdbSetMutation.data?.id) && (
                                        <p>Set updated</p>
                                    )
                                }
                            </li>
                        ))
                }
                {
                    draftSet && (
                        <li>
                            <ExerciseSetRow
                                onSetComplete={onDraftSetComplete}
                                set={draftSet}
                                setFieldsConfig={setFieldsConfig}
                                onFieldChange={({ target }) => {
                                    const fieldName = target.name;
                                    const fieldValue = target.value;


                                    setDraftSet(set => ({ ...set!, [fieldName]: fieldValue }));
                                }}
                                isSetDisabled={addNewIdbSetMutation.isPending}
                            />
                            <button
                                onClick={() => {
                                    setDraftSet(undefined);
                                }}
                            >
                                Delete
                            </button>
                        </li>
                    )
                }
            </ol>
        </>
    );
};