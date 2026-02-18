import {
    type TokenPayload
} from "../types/dto/authDTO.types.ts";
import prisma from "../lib/prisma.ts";
import type {User} from "../types/models/generated";
import type {LoginResult, RefreshAllTokensResult} from "../types/services/results/auth.results.ts";
import type {LoginArgs, RefreshAllTokensArgs} from "../types/services/args/auth.args.ts";
import {generateAccessToken, generateRefreshToken, validateRefreshToken} from "../utils/auth.utils.ts";
import {AppError} from "../error/appError.ts";




export const login = async (loginArgs: LoginArgs): Promise<LoginResult> => {
    const {email, password} = loginArgs;


    const user: User = await prisma.user.findFirstOrThrow({
        where: {
            email: email,
            password: password
        },
        //властивість include з властивістю address вказується тоді, коли потрібен повний обєкт User
        //бо по змовчуванню prisma поверне User без поля address, а додавши address Отримуємо UserWithRelations.
        // В моєму випадку мені це не потрібно
        //include: {
            //address: true
        //}
    });

    const payload: TokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role
    };

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

    const loginResult: LoginResult = {
        user: user,
        accessToken,
        refreshToken,
    }

    return loginResult;
}

export const refreshAllTokens = (refreshAllTokensArgs: RefreshAllTokensArgs): RefreshAllTokensResult => {
    const {refreshToken} = refreshAllTokensArgs;
    const payload: TokenPayload | null = validateRefreshToken(refreshToken);
    if(!payload) {
        throw new AppError({
            message: "refresh токен недійсний",
            code: "UNAUTHORIZED",
            statusCode: 401
        });
    }

    const newAccessToken: string = generateAccessToken({
        ...payload,
        iat: Date.now() / 1000,
        exp: Date.now() / 1000 + 60
    });
    const newRefreshToken: string = generateRefreshToken({
        ...payload,
        iat: Date.now() / 1000,
        exp: (Date.now() / 1000) + 60 * 2
    });
    console.log("New access token: ", newAccessToken);
    console.log("new refreshToken: ", refreshToken);

    const refreshAllTokensResult: RefreshAllTokensResult = {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    }


    return refreshAllTokensResult;
}