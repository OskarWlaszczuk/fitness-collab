import { pool } from "../db.js";
import { CustomError } from "../utils/CustomError.js";

export const findEntityByColumnField = async ({ entitiesTable, columnName, columnField }) => {
    try {
        const { rows: entityRows } = await pool.query(`SELECT * FROM ${entitiesTable} WHERE ${columnName} = $1`, [columnField]);

        const entity = entityRows?.[0];
        const isEntityAvailable = entityRows.length > 0;

        return { entity, isEntityAvailable };
    } catch (error) {
        throw new CustomError("Internal database error", 500);
    }
};