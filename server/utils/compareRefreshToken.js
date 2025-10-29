import bcrypt from "bcrypt";
import { CustomError } from "./CustomError.js"

export const compareRefreshToken = async (refreshToken, hashedRefreshToken) => {
    try {
        return await bcrypt.compare(refreshToken, hashedRefreshToken);
    } catch (error) {
        throw new CustomError("error comparying refresh tokens", 500);
    }
};