import { CustomError } from "../utils/CustomError";

export const checkIsAccessTokenPassed = async (request, response, next) => {
    const authHeader = request.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!accessToken) {
        const error = new CustomError("access token is required", 400);
        return next(error);
    }
    
    request.accessToken = accessToken;
    return next();
};