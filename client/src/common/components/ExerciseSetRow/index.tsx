import { useEffect, useLayoutEffect, useRef } from "react";
import { useDebounce } from "../../hooks/useDebounce";

export const ExerciseSetRow = ({
    set,
    onFieldChange,
    setFieldsConfig,
    onSetComplete,
    isSetDisabled,
}) => {
    const [timeoutId, debounce] = useDebounce();

    const hasSetChanged = useRef(false);

    useLayoutEffect(
        () => {
            if (hasSetChanged.current) {
                debounce(() => {
                    const isSetCompleted = Object.values(set).every(field => !!field);

                    if (isSetCompleted) {
                        onSetComplete(set);
                        hasSetChanged.current = false;
                    }
                    //nie mogę mutować właściwości stanu/props bezpośrednio 
                    // set.hasChanged = false
                }, 1000);
            }

            return () => {
                const id = timeoutId.current;
                clearTimeout(id);
            };
        },
        [set, onSetComplete, timeoutId, debounce, hasSetChanged]
    );

    return (
        <div>
            {
                setFieldsConfig.map(setConfig => (
                    <>
                        <input
                            disabled={isSetDisabled}
                            name={setConfig.name}
                            value={set[setConfig.name]}
                            type={setConfig.type}
                            onChange={(event) => {
                                onFieldChange(event);
                                hasSetChanged.current = true;
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