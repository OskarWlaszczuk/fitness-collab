import { config } from "dotenv";
import { verifyJwt } from "../utils/verifyJwt.js";
import { CustomError } from "../utils/CustomError.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
config();

export const validateRefreshTokenSignature = asyncErrorHandler(async (request, response, next) => {
    console.log("cheching is rt secret valid...");

    const refreshToken = request.refreshToken;
    const tokenPayload = await verifyJwt(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    request.tokenPayload = tokenPayload;
    return next();
});