import { config } from "dotenv";
import { CustomError } from "../utils/CustomError.js";

config();

export const checkIsRefreshTokenPassed = (request, response, next) => {
    const refreshToken = request.cookies?.[process.env.COOKIE_NAME];
    if (!refreshToken) {
        const error = new CustomError("refresh token is required", 400);
        return next(error);
    }

    request.refreshToken = refreshToken;
    return next();
};