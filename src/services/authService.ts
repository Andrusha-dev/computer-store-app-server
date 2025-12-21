import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/index.ts"; // Імпортуємо секрети з конфігурації



export function generateAccessToken(payload: any) {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET); // Токен действует 1 час
}

export function generateRefreshToken(payload: any) {
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET);
    return refreshToken;
}

export const validateAccessToken = (accessToken: string) => {
    try {
        return jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    } catch (error) {
        return null;
    }
}

export const validateRefreshToken = (refreshToken: string) => {
    try {
        return jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (error) {
        return null;
    }
}