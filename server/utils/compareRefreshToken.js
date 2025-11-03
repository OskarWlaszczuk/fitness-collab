import bcrypt from "bcrypt";
import { CustomError } from "./CustomError.js"

export const compareRefreshToken = async (refreshToken, hashedRefreshToken) => {
    try {
        return await bcrypt.compare(refreshToken, hashedRefreshToken);
    } catch (error) {
        throw error
    }
};