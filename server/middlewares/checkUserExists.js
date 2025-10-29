import { findEntityByColumnField } from "../services/findEntityByColumnField.js";
import { CustomError } from "../utils/CustomError.js";

export const checkUserExists = async (request, response, next) => {
    try {
        console.log("Checking is user exists...");

        const tokenPayload = request.tokenPayload;

        const { entity: user, isEntityAvailable: isUserExists } = await findEntityByColumnField({
            entitiesTable: "users",
            columnName: "id",
            columnField: tokenPayload.userId
        });

        if (!isUserExists) {
            const error = new CustomError("user does not found", 404);
            return next(error);
        }

        request.tokenPayload = tokenPayload;
        request.user = user;
        return next();
    } catch (error) {
        return next(error);
    }
};