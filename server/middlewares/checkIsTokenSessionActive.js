import { CustomError } from "../utils/CustomError.js";

export const checkIsTokenSessionActive = (request, response, next) => {
    const { refresh_token_hash } = request.user;

    const isSessionActive = !!refresh_token_hash;

    if (!isSessionActive) {
        const error = new CustomError("session expired, please log in again", 401);
        return next(error);
    }

    next();
};