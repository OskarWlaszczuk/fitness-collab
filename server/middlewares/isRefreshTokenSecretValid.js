import { config } from "dotenv";
import { verifyJwt } from "../utils/verifyJwt.js";
config();
export const isRefreshTokenSecretValid = async (request, response, next) => {
    console.log("cheching is rt secret valid...");

    const refreshToken = request.cookies?.refreshToken;

    try {
        const tokenPayload = await verifyJwt(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        request.tokenPayload = tokenPayload;
        return next();
    } catch (error) {
        next(error)
    }
}