import { useEffect } from "react";

export const ExerciseSetRow = ({ set, onFieldChange, setFieldsConfig, onSetChange }) => {

    useEffect(() => {
        if (set.hasChanged) {
            onSetChange(set);
        }
    }, [set, onSetChange]);

    return (
        <div>
            {
                setFieldsConfig.map(setConfig => (
                    <>
                        <input
                            name={setConfig.name}
                            value={set[setConfig.name]}
                            type={setConfig.type}
                            onChange={(event) => {
                                //jeden wspólny handler dla wszystkich pól serii
                                onFieldChange(event);
                            }}
                            min={0}
                        />
                        <label>{setConfig.label}</label>

                    </>
                ))
            }
        </div>
    );
};