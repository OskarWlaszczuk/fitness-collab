import { useState } from "react";
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

const defaultDraftSet: Set = {
    weightKg: undefined,
    reps: undefined,
    rir: undefined,
};

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
    const [draftSet, setDraftSet] = useState<Set | undefined>(defaultDraftSet);
    const queryClient = useQueryClient();

    const exerciseIdbSetsQuery = useExerciseIdbSetsQuery(exerciseId);
    const addNewIdbSetMutation = useSaveIdbSetMutation();
    const updateIdbSetMutation = useUpdateIdbSetMutation(exerciseId);
    const deleteIdbSetMutation = useDeleteIdbSetMutation(exerciseId);

    const onIdbSetChange = (updatedSet) => {
        const isSetCompleted = Object.values(updatedSet).every(field => !!field);
        const { hasChanged, ...set } = updatedSet;

        if (isSetCompleted) {
            updateIdbSetMutation.mutate(set)
        }
    };

    const onDraftSetChange = (updatedSet) => {
        const isSetCompleted = Object.values(updatedSet).every(field => !!field);
        const { hasChanged, ...set } = updatedSet;

        if (isSetCompleted) {
            addNewIdbSetMutation.mutate({ set, exerciseId })
            setDraftSet(undefined);
        }
    };

    const idbSets = exerciseIdbSetsQuery.data;

    if (!idbSets) {
        return <>loading...</>
    }

    return (
        <>
            <button
                disabled={!!draftSet}
                onClick={() => { setDraftSet(defaultDraftSet) }}
            >
                Add set
            </button><br />
            {
                idbSets
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
                                    queryClient.setQueryData(
                                        ["idb", "exerciseSets", exerciseId],
                                        (sets) => [
                                            ...sets.filter(({ id }) => id !== updatedSet.id) || [],
                                            updatedSet
                                        ]
                                    );
                                }}
                            />
                            <button
                                onClick={() => {
                                    deleteIdbSetMutation.mutate(set.id)
                                }}
                            >
                                delete
                            </button>
                        </>
                    ))
            }
            {
                draftSet && (
                    <>
                        <ExerciseSetRow
                            onSetChange={onDraftSetChange}
                            set={draftSet}
                            setFieldsConfig={setFieldsConfig}
                            onFieldChange={({ target }) => {
                                const fieldName = target.name;
                                const fieldValue = target.value;

                                setDraftSet(set => ({ ...set!, [fieldName]: fieldValue, hasChanged: true }));
                            }}
                        />
                        <button
                            onClick={() => {
                                setDraftSet(undefined);
                            }}
                        >
                            Delete
                        </button>
                    </>
                )
            }
        </>
    );
};