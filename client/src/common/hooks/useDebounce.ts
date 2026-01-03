import { useCallback, useRef } from "react";

export const useDebounce = () => {
    const timeoutId = useRef(null);

    const debounce = useCallback(
        (delayedFunction: () => void, delay: number) => {
            clearTimeout(timeoutId.current);

            timeoutId.current = setTimeout(
                () => {
                    delayedFunction();
                },
                delay
            );
        },
        []
    );

    return [
        timeoutId,
        debounce
    ];
};