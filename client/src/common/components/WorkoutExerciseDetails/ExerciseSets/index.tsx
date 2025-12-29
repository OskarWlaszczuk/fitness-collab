import { useState } from "react";
import type { Set } from "../../../types/Set";
import { ExerciseSetRow } from "../../ExerciseSetRow";
import { IdbSetRows } from "./IdbSetRows";

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

    const [draftSet, setDraftSet] = useState<Set | undefined>(defaultDraftSet);

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