export const ExerciseSetRow = ({ set, onFieldChange, setFieldsConfig }) => {
    //system sprawdzania wiersza serii po zmianie jednego z jego pól
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