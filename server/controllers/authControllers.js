import { config } from "dotenv";
import { pool } from "../db.js";
import bcrypt from "bcrypt";
import { CustomError } from "../utils/CustomError.js";
import { generateJWTs } from "../utils/generateJWTs.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js"

config();

//services
export const startUserTokenSession = async ({ userId, hashedRefreshToken }) => {
    try {
        await pool.query(
            "UPDATE users SET refresh_token_hash = $1 WHERE id = $2",
            [hashedRefreshToken, userId]
        );
    } catch (error) {
        throw error
    }
};
export const registerUser = async ({ userData, roleName }) => {
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
        console.log("Inserted new user:", user);

        switch (roleName) {
            case "trainer":
                await client.query('INSERT INTO trainers (user_id) VALUES ($1)', [user.id]);
                break;

            case "client":
                await client.query('INSERT INTO clients (user_id) VALUES ($1)', [user.id]);
                break;

            default:
                throw new CustomError("invalid role", 400);
        }

        await client.query('COMMIT');

        return user;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const findEntityByColumnField = async ({ entitiesTable, columnName, columnField }) => {
    try {
        const { rows: entityRows } = await pool.query(`SELECT * FROM ${entitiesTable} WHERE ${columnName} = $1`, [columnField]);

        const entity = entityRows?.[0];
        const isEntityAvailable = entityRows.length > 0;

        return { entity, isEntityAvailable };
    } catch (error) {
        //jakim błędem tu rzucić?
        throw error;
    }
}

//controllers

export const register = asyncErrorHandler(async (request, response, next) => {
    const { email, name, surname, nickname, password, roleName } = request.body;

    const {
        isEntityAvailable: isRoleAvailable,
        entity: role
    } = await findEntityByColumnField({
        entitiesTable: "roles",
        columnName: "name",
        columnField: roleName
    });

    if (!isRoleAvailable) {
        const error = new CustomError("invalid role", 400);
        next(error);
    }

    const {
        isEntityAvailable: isEmailRegistered,
    } = await findEntityByColumnField({
        entitiesTable: "users",
        columnName: "email",
        columnField: email
    });

    if (isEmailRegistered) {
        const error = new CustomError(`email ${email} already registered`, 409);
        next(error);
    }

    const {
        isEntityAvailable: isNicknameRegistered,
    } = await findEntityByColumnField({
        entitiesTable: "users",
        columnName: "nickname",
        columnField: nickname
    });

    if (isNicknameRegistered) {
        const error = new CustomError(`Nickname ${nickname} already registered`, 409);
        next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await registerUser({
        userData: [email, name, surname, nickname, hashedPassword],
        roleName,
    });

    const { accessToken, refreshToken, hashedRefreshToken } = await generateJWTs({ roleName, userId: user.id });

    await startUserTokenSession({ hashedRefreshToken, userId: user.id })

    response.cookie(
        process.env.COOKIE_NAME,
        refreshToken,
        {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: process.env.COOKIE_PATH,
            maxAge: 7 * 24 * 3600 * 1000,
        }
    );

    return response
        .status(200)
        .json({
            accessToken,
            user,
            role
        });
});

export const login = asyncErrorHandler(async (request, response, next) => {
    const { email, password, roleName } = request.body;
    console.log(`logging ${roleName} ${email}...`);

    const {
        isEntityAvailable: isRoleAvailable,
        entity: role
    } = await findEntityByColumnField({
        entitiesTable: "roles",
        columnName: "name",
        columnField: roleName
    });

    if (!isRoleAvailable) {
        const error = new CustomError("invalid role", 400);
        next(error);
    }

    const {
        isEntityAvailable: isEmailRegistered,
        entity: user
    } = await findEntityByColumnField({
        entitiesTable: "users",
        columnName: "email",
        columnField: email
    });

    if (!isEmailRegistered) {
        const error = new CustomError(`email ${email} does not registered`, 409);
        next(error);
    }

    const { password_hash, refresh_token_hash, ...responseUserData } = user;

    const isValidPassword = await bcrypt.compare(password, password_hash);
    if (!isValidPassword) {
        const error = new CustomError("invalid password", 409);
        next(error);
    }

    const { accessToken, refreshToken, hashedRefreshToken } = await generateJWTs({ userId: user.id, roleName });
    await startUserTokenSession({ hashedRefreshToken, userId: user.id })

    response.cookie(
        process.env.COOKIE_NAME,
        refreshToken,
        {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: process.env.COOKIE_PATH,
            maxAge: 7 * 24 * 3600 * 1000,
        }
    );

    response
        .status(201)
        .json({
            success: true,
            data: {
                user: responseUserData,
                role,
                accessToken,
            }
        });
});