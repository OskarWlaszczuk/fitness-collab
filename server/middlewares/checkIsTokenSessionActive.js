import { CustomError } from "../utils/CustomError.js";

export const checkIsTokenSessionActive = (request, response, next) => {
    const { hashedRefreshToken } = request.user;

    const isSessionActive = !!hashedRefreshToken;

    if (!isSessionActive) {
        const error = new CustomError("session expired, please log in again", 401);
        return next(error);
    }

    next();
};