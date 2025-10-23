import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

export const generateAccessToken = (tokenPayload) => {
    const accessToken = jwt.sign(
        tokenPayload,
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TTL,
        }
    );

    return accessToken;
};