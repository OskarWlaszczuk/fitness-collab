import util from "util";
import jwt from "jsonwebtoken";
import { CustomError } from "./CustomError.js";

export const verifyJwt = async (token, tokenSecret) => {
    try {
        return await util.promisify(jwt.verify)(token, tokenSecret)
    } catch {
        const error = new CustomError("error verifying JWT signature", 401);
        throw error
    }
};