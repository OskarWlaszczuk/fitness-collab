import bcrypt from "bcrypt";
import { CustomError } from "../utils/CustomError.js";

export const validateTokenSession = async (request, response, next) => {
    try {
        console.log("checking is rt session fresh...");

        const refreshToken = request.cookies?.refreshToken;
        const hashedRefreshToken = request.user.refresh_token_hash;

        const isSessionValid = !!hashedRefreshToken && await bcrypt.compare(refreshToken, hashedRefreshToken);

        if (!isSessionValid) {
            const error = new CustomError("session expired, please log in again", 401);
            return next(error);
        }

        return next();
    } catch (error) {
        return next(new CustomError("Error verifying session", 500));
    }
};