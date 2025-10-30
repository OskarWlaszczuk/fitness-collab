import { CustomError } from "../utils/CustomError.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { compareRefreshToken } from "../utils/compareRefreshToken.js";

export const checkIsRefreshTokenIntegrated = asyncErrorHandler(async (request, response, next) => {
    console.log("checking is rt session fresh...");

    const refreshToken = request.refreshToken;
    const hashedRefreshToken = request.user.refresh_token_hash;

    const isTokenIntegrated = await compareRefreshToken(refreshToken, hashedRefreshToken);

    if (!isTokenIntegrated) {
        const error = new CustomError("session expired, please log in again", 401);
        return next(error);
    }

    return next();
});