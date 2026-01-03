import type { IdbSet } from "../../../../common/hooks/useExerciseIdbSetsQuery";
import type { Set } from "../../../../common/types/Set";

const indexedDb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

export const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDb.open("WorkoutSessionExercisesDatabase", 2);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            //tworzenie object store , aby przechowywać dane o ćwiczeniach. Każde ćwiczenie musi mieć id, które będzie ręcznie dodawane
            const exercisesStore = db.createObjectStore("exercises", { keyPath: "id", autoIncrement: false });

            //tworzenie object store , aby przechowywać dane o seriach ćwiczenia. Każde ćwiczenie musi mieć unikatowe id, auto dodawane
            const exerciseSetsStore = db.createObjectStore("exerciseSets", { keyPath: "id", autoIncrement: true });

            //stworzenie indexu exerciseId, aby móc wyszukiwać serię na podstawie ćwiczenia
            exerciseSetsStore.createIndex("exerciseId", "exerciseId", { unique: false });
        };

        request.onerror = (event) => {
            console.error(`Database error: ${event.target.error?.message}`);
            return reject(event.target.error?.message);
        };

        request.onsuccess = (event) => resolve(event.target.result);

    });
};

export const getExerciseSets = async (exerciseId): Promise<IdbSet[]> => {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["exerciseSets"], "readwrite");

        const setsStore = transaction.objectStore("exerciseSets");
        const exerciseIdIndex = setsStore.index("exerciseId");

        const exerciseSetsQuery = exerciseIdIndex.getAll(exerciseId);
        exerciseSetsQuery.onsuccess = () => {

            resolve(exerciseSetsQuery.result)
        };

        transaction.oncomplete = () => {
            //czy zamykać połączenie po udanej transakcji?
            db.close();
        }
    });
};

export const addNewExerciseSet = async (exerciseId: number, set: Set): Promise<IdbSet> => {
    const db = await openDB();

    return new Promise((resolve, reject) => {

        //otwarcie transakcji do konkretnej bazy, określenie operacji
        const transaction = db.transaction(["exerciseSets", "exercises"], "readwrite");
        //wybranie który object store używamy
        const exercisesStore = transaction.objectStore("exercises");
        const setsStore = transaction.objectStore("exerciseSets");

        //sprawdzenie, czy ćwiczenie istnieje w exercises store
        //pobranie danych ze store na podstawie key path
        const exerciseQuery = exercisesStore.get(exerciseId);

        exerciseQuery.onsuccess = () => {
            //handler po pobraniu danych
            const exercise = exerciseQuery.result

            if (!exercise) {
                //domyślnie dodać rzucanie błędu, jeżeli ćwiczenia nie ma w bazie

                //dodać ćwiczenie do exercises store
                exercisesStore.put({ id: exerciseId });
            }
        }

        exerciseQuery.onerror = () => {
            const error = exerciseQuery.error;
            reject(error)
        }

        const addSetQuery = setsStore.put({ exerciseId, ...set });


        addSetQuery.onsuccess = () => {
            const newSetKey = addSetQuery.result;
            const getSetQuery = setsStore.get(newSetKey);

            getSetQuery.onsuccess = () => {
                const newSet = getSetQuery.result;
                console.log("new set:", newSet);

                resolve(newSet)
            }

        };

        addSetQuery.onerror = () => {
            const error = addSetQuery.error;
            reject(error)
        }

        transaction.oncomplete = () => {
            //czy zamykać połączenie po udanej transakcji?
            db.close();
        }
    });
};

export const updateExercisSet = async (set) => {
    const db = await openDB();
    console.log("mutating set:", set);

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["exerciseSets"], "readwrite");

        const setsStore = transaction.objectStore("exerciseSets");

        setsStore.put(set);

        const getUpdatedSetQuery = setsStore.get(set.id);
        getUpdatedSetQuery.onsuccess = () => {
            const updatedSet = getUpdatedSetQuery.result;
            resolve(updatedSet);
        }
        // const getSetQuery = setsStore.get(set.id);

        // getSetQuery.onsuccess = () => {
        //     const set = getSetQuery.result;
        //     const updatedSet = { ...set, changedField };
        //     const updateSetQuery = setsStore.put(updatedSet);
        //     updateSetQuery.onsuccess = () => {
        //         resolve(updateSetQuery.result);
        //     }
        // };

        transaction.oncomplete = () => {
            //czy zamykać połączenie po udanej transakcji?
            db.close();
        }
    });
};

export const deleteExerciseSet = async (setId) => {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["exerciseSets"], "readwrite");

        const setsStore = transaction.objectStore("exerciseSets");

        const updateSetQuery = setsStore.delete(setId);

        updateSetQuery.onsuccess = () => {
            resolve(updateSetQuery.result)
        };

        updateSetQuery.onerror = () => {
            resolve(updateSetQuery.error)
        };

        transaction.oncomplete = () => {
            //czy zamykać połączenie po udanej transakcji?
            db.close();
        };
    });
};