interface Hint {
    type: "breathing" | "setup" | "execution" | "commonMistakes",
    order: number;
    description: string;
}

const workoutExcersiseDetails = {
    lastResults: [
        {
            setNumber: 1,
            reps: 10,
            rir: 2,
            pace: {
                eccentric: 2,
                concentric: 1,
                eccentricPause: 1,
                concentricPause: 0,
            },
            weight: {
                type: "kg",
                amount: 100,
            },
        },
        {
            setNumber: 1,
            reps: 10,
            rir: 2,
            pace: {
                eccentric: 2,
                concentric: 1,
                eccentricPause: 1,
                concentricPause: 0,
            },
            weight: {
                type: "kg",
                amount: 100,
            },
        },
        {
            setNumber: 1,
            reps: 10,
            rir: 2,
            pace: {
                eccentric: 2,
                concentric: 1,
                eccentricPause: 1,
                concentricPause: 0,
            },
            weight: {
                type: "kg",
                amount: 100,
            },
        },
    ],
    hints: [
        {
            id: 1,
            hint: {
                type: "breathing",
                id: 1,
            },
            description: "Weź głęboki wdech przed rozpoczęciem zejścia w dół.",
        },
        {
            id: 2,
            hint: {
                type: "breathing",
                id: 2,
            },
            description: "opis opis",
        },
        {
            id: 3,
            hint: {
                type: "breathing",
                id: 3,
            },
            description: "Ustaw stopy na szerokość barków lub nieco szerzej."
        },
        {
            id: 4,
            hint: {
                type: "breathing",
                id: 4,
            },
            description: "Zainicjuj ruch cofnięciem bioder i \
            jednoczesnym ugięciem kolan."
        },
        {
            id: 5,
            hint: {
                type: "breathing",
                id: 5,
            },
            type: "common mistakes",
            description: "Plecy zaokrąglone w dolnej fazie ruchu."
        },
    ],
};

const excersiseHintListTypes = [
    {
        id: 1,
        name: "breathing",
    },
    {
        id: 2,
        name: "execution",
    },
    {
        id: 3,
        name: "common mistakes",
    },
    {
        id: 4,
        name: "setup",
    },
];

export const WorkoutPlanDayExcersise = () => {

    return (
        <section
            style={{
                backgroundColor: "#E4E6F0",
                padding: "10px",
                margin: "8px 0"
            }}
        >
            {
                excersiseHintListTypes.map(({ id, name }) => {
                    return (
                        <>
                            <header>{name}</header>
                            <ol>
                                {
                                    workoutExcersiseDetails.hints
                                        .filter(({ hint }) => hint.id === id)
                                        .map(({ description }) => (
                                            <li>{description}</li>
                                        ))
                                }
                            </ol>
                        </>
                    )
                })
            }

        </section>
    );
};