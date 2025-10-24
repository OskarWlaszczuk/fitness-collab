import { findEntityByColumnField } from "../services/findEntityByColumnField.js";
import { CustomError } from "../utils/CustomError.js";

export const isUserExists = async (request, response, next) => {
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

    request.user = user;
    next();
};