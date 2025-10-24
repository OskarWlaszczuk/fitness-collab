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

config();

export const refreshAccessToken = async (request, response) => {
    console.log("refreshing token...");
    const { userId, roleName } = request.tokenPayload;

    const tokenPayload = { userId, roleName };

    const accessToken = generateAccessToken(tokenPayload);

    console.log(`Access token odświeżony: ${accessToken}`);
    response.status(200).json({ accessToken });
};

export const logout = async (request, response) => {
    console.log("loagoutting user...");
    const { tokenPayload } = request;

    await endUserTokenSession(tokenPayload.userId);

    response.clearCookie(process.env.COOKIE_NAME, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: process.env.COOKIE_PATH,
    });

    console.log("user logouted");

    response.sendStatus(204);
};

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