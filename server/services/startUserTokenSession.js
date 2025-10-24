import { pool } from "../db.js";
import { CustomError } from "../utils/CustomError.js";

export const startUserTokenSession = async ({ userId, hashedRefreshToken }) => {
    try {
        await pool.query(
            "UPDATE users SET refresh_token_hash = $1 WHERE id = $2",
            [hashedRefreshToken, userId]
        );
    } catch (error) {
        throw new CustomError("Internal database error", 500);
    }
};