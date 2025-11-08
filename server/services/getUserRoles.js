import { pool } from "../db.js";
import { CustomError } from "../utils/CustomError.js";

export const getUserRoles = async (userId, roleId) => {
    try {
        const { rows: userRoles } = await pool.query("SELECT * FROM user_roles WHERE user_id = $1 AND role_id = $2 ", [userId, roleId]);

        const isUserRegisteredInRole = userRoles.length > 0;
        return { userRoles, isUserRegisteredInRole }
    } catch (error) {
        throw error;
    }
};