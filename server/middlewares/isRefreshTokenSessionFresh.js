import bcrypt from "bcrypt";
import { CustomError } from "../utils/CustomError.js";

export const isRefreshTokenSessionFresh = async (request, response, next) => {
    console.log("checking is rt session fresh...");

    const refreshToken = request.cookies?.refreshToken;
    const hashedRefreshToken = request.user.refresh_token_hash;

    const isSessionValid = !!hashedRefreshToken && await bcrypt.compare(refreshToken, hashedRefreshToken);

    if (!isSessionValid) {
        const error = new CustomError("session expired, please log in again", 401);
        return next(error);
    }

    next();
};