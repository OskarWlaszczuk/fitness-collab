import { CustomError } from "../utils/CustomError.js";

export const isRefreshTokenStoredInCoookies = (request, response, next) => {
    console.log("checking is rt stored in coookies");

    const refreshToken = request.cookies?.refreshToken;

    if (!refreshToken) {
        const error = new CustomError("refresh token is required", 400);
        return next(error);
    }

    next();
};