import { useState } from "react";
import type { Set } from "../../../types/Set";
import { ExerciseSetRow } from "../../ExerciseSetRow";
import { IdbSetRows } from "./IdbSetRows";
import { useQueryClient } from "@tanstack/react-query";
import type { IdbSet } from "../../../hooks/useExerciseIdbSetsQuery";

interface ExerciseSetsProps {
    exerciseId: number;
}

const defaultDraftSet: Set = {
    weightKg: undefined,
    reps: undefined,
    rir: undefined,
};
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
    const queryClient = useQueryClient();

    const [draftSet, setDraftSet] = useState<Set | undefined>(defaultDraftSet);

    const addNewIdbSet = (newSet) => {
        queryClient.setQueryData(
            ["idb", "exerciseSets", exerciseId],
            (sets: IdbSet[]) => (
                [
                    ...sets,
                    newSet
                ]
            )
        );
    };

    const onDraftSetChange = (updatedSet) => {
        console.log(`set ${updatedSet.id} zmienił`);
        const isSetCompleted = Object.values(updatedSet).every(field => !!field);

        if (isSetCompleted) {
            console.log(`draft set completed`);
            addNewIdbSet(draftSet);
        }
    };

    return (
        <>
            <button
                disabled={!!draftSet}
                onClick={() => { setDraftSet(defaultDraftSet) }}
            >
                Add set
            </button><br />
            <IdbSetRows setFieldsConfig={setFieldsConfig} exerciseId={exerciseId} />
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

                                setDraftSet(set => ({ ...set!, [fieldName]: fieldValue }));
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