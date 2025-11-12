import { CustomError } from "../utils/CustomError.js";

export const authorizeUserRole = (allowedRoleIds) => {
    return async (request, response, next) => {
        const tokenPayload = request.tokenPayload;
        console.log(`Allowed role: ${allowedRoleIds}, token role: ${tokenPayload.roleId}`);
        if (!allowedRoleIds.includes(tokenPayload.roleId)) {
            const error = new CustomError("user is not register on this role", 403);
            return next(error);
        }

        return next();
    };
};