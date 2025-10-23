import { config } from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateAccessToken } from "./generateAccessToken.js";

config();

export const generateJWTs = async ({ userId, roleName }) => {
    try {
        const tokenPayload = {
            userId: userId,
            roleName,
        };

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
        throw error
    }
};