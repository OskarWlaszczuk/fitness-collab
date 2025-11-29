import { useState } from "react";
import { SetFieldsSection } from "./SetFieldsSection";
import { useExerciseIdbSetsQuery } from "../../../../../common/hooks/useExerciseIdbSetsQuery";
import axios from "axios";

//różna konfiguracja pól serii w zależności od typu ćwiczenia
//dobieranie tablicy konfiguracyjnej w zależności od szczegółów pobranego ćwiczenia
const setFieldsConfig = [
    {
        id: "reps",
        name: "reps",
        type: "number",
        label: "x",
    },
    {
        id: "weightKg",
        name: "weightKg",
        type: "number",
        label: "kg",
    },
    {
        id: "rir",
        name: "rir",
        type: "number",
        label: "RiR",
    },
];

const defaultSet = {
    id: 1,
    weightKg: undefined,
    reps: undefined,
    rir: undefined,
};

interface WorkoutExerciseProps {
    exerciseId: number;
}


export const WorkoutExercise = ({ exerciseId }: WorkoutExerciseProps) => {
    const { idbSets } = useExerciseIdbSetsQuery(exerciseId);
    console.log(idbSets);

    //jedyne źródło prawdy z danymi pól serii
    //jeżeli w IDB zapisane są serie dla konkretnego ćwiczenia to są dodawane na start do stanu sets
    //dzięki temu po odświeżeniu podstrony user nei traci swoich danych 
    //jeżeli user nie zapisał żadnych danych serii to doda się domyślna tablica
    const [sets, setSets] = useState(idbSets || [defaultSet]);



    return (
        <section
            style={{
                backgroundColor: "#E4E6F0",
                padding: "10px",
                margin: "8px 0"
            }}
        >
            <button
                disabled={sets.some(set => Object.values(set).some(value => !value))}
                onClick={() => setSets(sets => [...sets, { ...defaultSet, id: sets.length + 1 }])}
            >
                Add set
            </button><br />
            {
                sets
                    .sort((a, b) => a.id - b.id)
                    .map(set => (
                        <>
                            <SetFieldsSection
                                key={set.id}
                                exerciseId={exerciseId}
                                fieldsConfig={setFieldsConfig}
                                set={set}
                                setSets={setSets}
                            /><br />
                        </>
                    ))
            }
        </section>
    );
};