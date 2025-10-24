import { pool } from "../db.js";

export const endUserTokenSession = async (userId) => {
    try {
        await pool.query(
            "UPDATE users SET refresh_token_hash = NULL WHERE id = $1",
            [userId]
        );
    } catch (error) {
        throw error;
    }
};