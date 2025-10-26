import { CustomError } from "../utils/CustomError.js";

export const checkIsRefreshTokenPassed = (request, response, next) => {
    const refreshToken = request.cookies?.refreshToken;
    
    if (!refreshToken) {
        const error = new CustomError("refresh token is required", 400);
        return next(error);
    }

    return next();
};