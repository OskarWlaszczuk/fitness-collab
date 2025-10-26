import { pool } from "../db.js";
import { CustomError } from "../utils/CustomError.js";

export const registerUser = async ({ userData, modeName }) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { rows: userRows } = await client.query(
            "INSERT INTO users (email, name, surname, nickname, password_hash) \
            VALUES ($1, $2, $3, $4, $5) \
            RETURNING id, name, surname, email, created_at",
            [...userData]
        );
        const user = userRows[0];

        switch (modeName) {
            //dodanie user_id i odpowiedniego mode_id do tabeli user_modes
            case "trainer":
                await client.query('INSERT INTO trainers (user_id) VALUES ($1)', [user.id]);
                break;

            case "client":
                await client.query('INSERT INTO clients (user_id) VALUES ($1)', [user.id]);
                break;

            default:
                throw new CustomError("invalid mode", 400);
        }

        await client.query('COMMIT');

        return user;
    } catch (error) {
        await client.query('ROLLBACK');
        throw new CustomError("Internal database error", 500);

    } finally {
        client.release();
    }
};