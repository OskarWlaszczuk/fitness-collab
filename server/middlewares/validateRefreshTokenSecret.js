import { config } from "dotenv";
import { verifyJwt } from "../utils/verifyJwt.js";
import { CustomError } from "../utils/CustomError.js";
config();

export const validateRefreshTokenSecret = async (request, response, next) => {
    console.log("cheching is rt secret valid...");

    const refreshToken = request.cookies?.refreshToken;

    try {
        const tokenPayload = await verifyJwt(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        request.tokenPayload = tokenPayload;
        return next();
    } catch {
        const error = new CustomError("error verifying refresh token secret", 401);
        return next(error)
    }
}