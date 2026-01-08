import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/index.ts";
import {
    type LoginRequest, type LoginResponse, LoginResponseSchema,
    type TokenPayload
} from "../types/dto/authDTO.types.ts";
import type {User} from "../types/models/user.ts";
import {users} from "../data/users.ts"; // Імпортуємо секрети з конфігурації



export function generateAccessToken(payload: TokenPayload) {
    const accessToken: string =  jwt.sign(payload, ACCESS_TOKEN_SECRET); // Токен действует 1 час
    return accessToken;
}

export function generateRefreshToken(payload: TokenPayload) {
    const refreshToken: string = jwt.sign(payload, REFRESH_TOKEN_SECRET);
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

export const login = (loginRequest: LoginRequest) => {
    const {email, password} = loginRequest;

    const user: User | undefined = users.find((user) => user.email === email && user.password === password);

    if (!user) {
        return null;
    }

    const payload: TokenPayload = { id: user.id, email: user.email, role: user.role };

    const accessToken = generateAccessToken({
        ...payload,
        iat: Date.now() / 1000,
        exp: Date.now() / 1000 + 60
    });
    console.log("Starting access token: ", accessToken);
    const refreshToken = generateRefreshToken({
        ...payload,
        iat: Date.now() / 1000,
        exp: (Date.now() / 1000) + 60 * 2
    });

    const loginResponse: LoginResponse = {
        accessToken,
        refreshToken,
    }

    const validatedLoginResponse: LoginResponse = LoginResponseSchema.parse(loginResponse);

    return validatedLoginResponse;
}