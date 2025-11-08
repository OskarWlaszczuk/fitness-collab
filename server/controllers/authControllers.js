import { config } from "dotenv";
import { CustomError } from "../utils/CustomError.js";
import { generateJWTs } from "../utils/generateJWTs.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js"
import { registerUser } from "../services/registerUser.js";
import { findEntityByColumnField } from "../services/findEntityByColumnField.js";
import { startUserTokenSession } from "../services/startUserTokenSession.js";
import { generateAccessToken } from "../utils/generateAccessToken.js";
import { endUserTokenSession } from "../services/endUserTokenSession.js";
import { validatePassword } from "../utils/validatePassword.js";
import { getUserRoles } from "../services/getUserRoles.js";
import { hashUserPassword } from "../utils/hashUserPassword.js";

config();

export const refreshAccessToken = asyncErrorHandler(async (request, response) => {
    console.log("refreshing token...");
    const { userId, roleId } = request.tokenPayload;

    const tokenPayload = { userId, roleId };
    const accessToken = generateAccessToken(tokenPayload);

    response.status(200).json({ accessToken });
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
    const { email, name, surname, nickname, password, roleId } = request.body;

    const {
        isEntityAvailable: isRoleAvailable,
        entity: role
    } = await findEntityByColumnField({
        entitiesTable: "roles",
        columnName: "id",
        columnField: roleId
    });

    if (!isRoleAvailable) {
        const error = new CustomError("invalid role", 400);
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

    const hashedPassword = await hashUserPassword(password);

    const user = await registerUser({
        userData: [email, name, surname, nickname, hashedPassword],
        role,
    });

    const tokenPayload = {
        userId: user.id,
        roleId: role.id,
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
                role
            }
        });
});

export const login = asyncErrorHandler(async (request, response, next) => {
    const { email, password, roleId } = request.body;

    const {
        isEntityAvailable: isRoleAvailable,
        entity: role
    } = await findEntityByColumnField({
        entitiesTable: "roles",
        columnName: "id",
        columnField: roleId
    });

    if (!isRoleAvailable) {
        const error = new CustomError("invalid role", 400);
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

    const { isUserRegisteredInRole } = await getUserRoles(user.id, roleId);

    if (!isUserRegisteredInRole) {
        const error = new CustomError("user is not register on this role", 403);
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
        roleId: role.id,
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
            user: responseUserData,
            role,
            accessToken,
        });
});