import { config } from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateAccessToken } from "./generateAccessToken.js";
import { CustomError } from "./CustomError.js";

config();

export const generateJWTs = async (tokenPayload) => {
    try {
        const accessToken = generateAccessToken(tokenPayload);

        const refreshToken = jwt.sign(
            tokenPayload,
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TTL
            }
        );

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        return { accessToken, refreshToken, hashedRefreshToken };
    } catch (error) {
        throw new CustomError("Internal package error", 500);
    }
};