const exercises = [
    {
        id: 2,
    },
    {
        id: 3,
    },
];

const exerciseSets = [
    {
        exerciseId: 2,
        reps: 10,
        weightKg: 100,
        rir: 1,
    },
    {
        exerciseId: 2,
        reps: 9,
        weightKg: 100,
        rir: 1,
    },
    {
        exerciseId: 2,
        reps: 8,
        weightKg: 100,
        rir: 1,
    },
    {
        exerciseId: 3,
        reps: 10,
        weightKg: 100,
        rir: 1,
    },
    {
        exerciseId: 3,
        reps: 9,
        weightKg: 100,
        rir: 1,
    },
    {
        exerciseId: 3,
        reps: 8,
        weightKg: 100,
        rir: 1,
    },
];

const indexedDb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

export const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDb.open("WorkoutSessionExercisesDatabase", 2);

        // request.onerror = () => reject(request.error);

        //EVENT HANDLERY NIE WYKONUJĄ SIĘ TERAZ
        //JS SAM JE WYKONA W ODPOWIEDNIM MOMENCIE I PRZEKAŻE MI DANE Z BAZY
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            //tworzenie object store , aby przechowywać dane o ćwiczeniach. Każde ćwiczenie musi mieć id, które będzie ręcznie dodawane
            const exercisesStore = db.createObjectStore("exercises", { keyPath: "id", autoIncrement: false });

            //tworzenie object store , aby przechowywać dane o seriach ćwiczenia. Każde ćwiczenie musi mieć unikatowe id, auto dodawane
            const exerciseSetsStore = db.createObjectStore("exerciseSets", { keyPath: "id", autoIncrement: true });

            //stworzenie indexu exerciseId, aby móc wyszukiwać serię na podstawie ćwiczenia
            exerciseSetsStore.createIndex("exerciseId", "exerciseId", { unique: false });

            exercisesStore.transaction.oncomplete = (event) => {
                // Store values in the newly created objectStore.
                const exercisesStoreData = db
                    .transaction("exercises", "readwrite")
                    .objectStore("exercises");

                exercises.forEach((exercise) => {
                    exercisesStoreData.add(exercise);
                });

                const exerciseSetsStoreData = db
                    .transaction("exerciseSets", "readwrite")
                    .objectStore("exerciseSets");

                exerciseSets.forEach((set) => {
                    exerciseSetsStoreData.add(set);
                });
            };
        };

        request.onerror = (event) => {
            console.error(`Database error: ${event.target.error?.message}`);
            return reject(event.target.error?.message);
        };

        //gdy uda się połączyć z bazą
        request.onsuccess = (event) => resolve(event.target.result);

    });
};

export const getExerciseSets = async (exerciseId) => {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["exerciseSets"], "readwrite");

        const setsStore = transaction.objectStore("exerciseSets");
        const exerciseIdIndex = setsStore.index("exerciseId");

        const exerciseSetsQuery = exerciseIdIndex.getAll(exerciseId);
        //gdybym musiał zwrócić wiele obietnic - użyć wtedy promise.all?
        exerciseSetsQuery.onsuccess = () => resolve(exerciseSetsQuery.result);

        console.log(exerciseSetsQuery);

        transaction.oncomplete = () => {
            db.close();
        }
    });
};