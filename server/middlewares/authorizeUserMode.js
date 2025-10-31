import { getUserModes } from "../services/getUserModes.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/CustomError.js";

export const authorizeUserMode = (allowedModeIds) => {
    return async (request, response, next) => {
        const tokenPayload = request.tokenPayload;
        console.log(`Allowed mode: ${allowedModeIds}, token mode: ${tokenPayload.modeId}`);

        if (allowedModeIds.includes(tokenPayload.modeId)) {
            const error = new CustomError("user is not register on this mode", 403);
            return next(error);
        }
        return next();
    };
};