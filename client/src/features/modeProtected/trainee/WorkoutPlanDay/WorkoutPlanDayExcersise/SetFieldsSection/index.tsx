import { useExerciseIdbSetsQuery } from "../../../../../../common/hooks/useExerciseIdbSetsQuery";
import { useSaveIdbSet } from "../../../../../../common/hooks/useSaveIDBSet";
import { useUpdateIdbSet } from "../../../../../../common/hooks/useUpdateIDBSet";
import type { Set } from "../../../../../../common/types/Set";

export interface FieldConfig {
    id: string;
    name: string;
    type: string,
    label: string,
}

interface SetFieldsSectionProps {
    exerciseId: number;
    fieldsConfig: FieldConfig[];
    set: Set;
    setSets: any;
}

export const SetFieldsSection = ({
    exerciseId,
    fieldsConfig,
    set,
    setSets,
}: SetFieldsSectionProps) => {

    const { saveIdbSet } = useSaveIdbSet();
    const { updateIdbSet } = useUpdateIdbSet();
    const { idbSets } = useExerciseIdbSetsQuery(exerciseId);

    //dodać pobieranie stanu wszystkich zapisanych w IDB serii danego ćwiczeni
    //aby sprawdzić, czy prop set znajduje się wśród nich -
    //możliwość sprawdzenia, czy ma zostać dodany, czy tylko zaapdatetowany

    const isSetCompleted = Object.values(set).every(set => set);

    const isSetStoredInIDB = !idbSets?.length && idbSets?.map(({ id }) => id).includes(set.id);

    if (isSetCompleted && set.hasChanged === true) {
        console.log("set completed", set);

        if (isSetStoredInIDB) {
            console.log("updating set");
        } else {
            saveIdbSet(set,)
        }
    }

    return (
        <>
            {
                fieldsConfig.map(({ id, name, type, label }) => (
                    <>
                        <input
                            name={name}
                            value={set?.[name] || ""}
                            type={type}
                            onChange={({ target }) => {

                                const name = target.name;
                                const value = Number(target.value);

                                setSets(
                                    (sets) => (
                                        [
                                            ...sets.filter(({ id }) => id !== set.id),
                                            {
                                                ...sets.find(({ id }) => id === set.id),
                                                [name]: value,
                                                hasChanged: true,
                                            },
                                        ]
                                    )
                                )
                            }}
                            id={id}
                        />
                        <label htmlFor={id}>{label}</label>
                        {" "}
                    </>
                ))
            }
            <button
                onClick={() => {
                    setSets((sets) => ([...sets.filter(({ id }) => id !== set.id)]))
                }}
            >Delete set
            </button>
        </>
    );
};
