import { config } from "dotenv";
import bcrypt from "bcrypt";
import { CustomError } from "../utils/CustomError.js";
import { generateJWTs } from "../utils/generateJWTs.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js"
import { registerUser } from "../services/registerUser.js";
import { findEntityByColumnField } from "../services/findEntityByColumnField.js";
import { startUserTokenSession } from "../services/startUserTokenSession.js";
import { generateAccessToken } from "../utils/generateAccessToken.js";
import { endUserTokenSession } from "../services/endUserTokenSession.js";
import { validatePassword } from "../utils/validatePassword.js";
import { pool } from "../db.js";

config();

export const refreshAccessToken = asyncErrorHandler(async (request, response) => {
    console.log("refreshing token...");
    const { userId, modeName } = request.tokenPayload;

    const tokenPayload = { userId, modeName };

    const accessToken = generateAccessToken(tokenPayload);

    console.log(`Access token odświeżony: ${accessToken}`);
    response.status(200).json({ data: { accessToken } });
});

export const logout = asyncErrorHandler(async (request, response) => {
    console.log("loagoutting user...");
    const { tokenPayload } = request;

    await endUserTokenSession(tokenPayload.userId);

    response.clearCookie(process.env.COOKIE_NAME, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: process.env.COOKIE_PATH,
    });

    console.log("user logouted");

    response.sendStatus(204);
});

export const register = asyncErrorHandler(async (request, response, next) => {
    const { email, name, surname, nickname, password, modeId } = request.body;

    const {
        isEntityAvailable: isModeAvailable,
        entity: mode
    } = await findEntityByColumnField({
        entitiesTable: "modes",
        columnName: "id",
        columnField: modeId
    });

    if (!isModeAvailable) {
        const error = new CustomError("invalid mode", 400);
        return next(error);
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
        return next(error);
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
        return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await registerUser({
        userData: [email, name, surname, nickname, hashedPassword],
        mode,
    });

    const tokenPayload = {
        userId: user.id,
        modeId: modeId,
    };

    const { accessToken, refreshToken, hashedRefreshToken } = await generateJWTs(tokenPayload);

    await startUserTokenSession({ hashedRefreshToken, userId: user.id })

    response.cookie(
        process.env.COOKIE_NAME,
        refreshToken,
        {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            path: process.env.COOKIE_PATH,
            maxAge: 7 * 24 * 3600 * 1000,
        }
    );

    return response
        .status(200)
        .json({
            data: {
                accessToken,
                user,
                mode
            }
        });
});

export const login = asyncErrorHandler(async (request, response, next) => {
    const { email, password, modeId } = request.body;

    const {
        isEntityAvailable: isModeAvailable,
        entity: mode
    } = await findEntityByColumnField({
        entitiesTable: "modes",
        columnName: "id",
        columnField: modeId
    });

    if (!isModeAvailable) {
        const error = new CustomError("invalid mode", 400);
        return next(error);
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
        return next(error);
    }

    const { rows: userModes } = await pool.query("SELECT * FROM user_modes WHERE user_id = $1 AND mode_id = $2 ", [user.id, modeId])

    if (!userModes.length) {
        const error = new CustomError(`user ${user.name} is not registered as ${mode.name}`, 409);
        return next(error);
    }

    const { password_hash, refresh_token_hash, ...responseUserData } = user;

    const isValidPassword = await validatePassword(password, password_hash);
    if (!isValidPassword) {
        const error = new CustomError("invalid password", 409);
        return next(error);
    }

    const tokenPayload = {
        userId: user.id,
        modeId: modeId,
    };

    const { accessToken, refreshToken, hashedRefreshToken } = await generateJWTs(tokenPayload);
    console.log(accessToken, refreshToken, hashedRefreshToken);

    await startUserTokenSession({ hashedRefreshToken, userId: user.id })

    response.cookie(
        process.env.COOKIE_NAME,
        refreshToken,
        {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            path: process.env.COOKIE_PATH,
            maxAge: 7 * 24 * 3600 * 1000,
        }
    );

    return response
        .status(201)
        .json({
            success: true,
            data: {
                user: responseUserData,
                mode,
                accessToken,
            }
        });
});