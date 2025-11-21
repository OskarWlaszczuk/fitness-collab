import { pool } from "../db.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";

export const getExerciseInstructions = asyncErrorHandler(async (request, response, next) => {
    const { id: excersiseId } = request.params;
    //zmienić zapytania
    const { rows: excersiseIntructions } = await pool.query(
        "SELECT excersise_instructions.id, description, name AS category \
        FROM excersise_instructions \
        JOIN instruction_categories \
        ON excersise_instructions.instruction_category_id = instruction_categories.id \
        WHERE excersise_instructions.excersise_id = $1",
        [excersiseId]
    );

    return response.status(200).json({ instructions: excersiseIntructions })
});