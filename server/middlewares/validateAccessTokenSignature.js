import { config } from "dotenv";
import { verifyJwt } from "../utils/verifyJwt.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
config();

export const validateAccessTokenSignature = asyncErrorHandler(async (request, response, next) => {
    const accessToken = request.accessToken;
    const tokenPayload = await verifyJwt(accessToken, process.env.ACCESS_TOKEN_SECRET);
    request.tokenPayload = tokenPayload;
    return next();
});