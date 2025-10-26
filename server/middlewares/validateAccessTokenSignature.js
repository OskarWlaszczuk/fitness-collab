import { config } from "dotenv";
import { verifyJwt } from "../utils/verifyJwt.js";
import { CustomError } from "../utils/CustomError.js";
config();

export const validateAccessTokenSignature = async (request, response, next) => {
    try {
        const accessToken = request.accessToken;
        const tokenPayload = await verifyJwt(accessToken, process.env.ACCESS_TOKEN_SECRET);
        request.tokenPayload = tokenPayload;
        return next();
    } catch {
        const error = new CustomError("error verifying access token signature", 401);
        return next(error)
    }
};