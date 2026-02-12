
import {type LoginResponse, type RefreshAllTokensResponse} from "../../types/dto/authDTO.types.ts";
import type {LoginResult, RefreshAllTokensResult} from "../../types/services/results/auth.results.ts";

export const toLoginResponse = (loginResult: LoginResult): LoginResponse => {
    const loginResponse: LoginResponse = {
        accessToken: loginResult.accessToken,
        refreshToken: loginResult.refreshToken
    }

    return loginResponse;
}

export const toRefreshAllTokensResponse = (refreshAllTokensResult: RefreshAllTokensResult): RefreshAllTokensResponse => {
    const refresAllTokensResponse: RefreshAllTokensResponse = {
        accessToken: refreshAllTokensResult.accessToken,
        refreshToken: refreshAllTokensResult.refreshToken
    }

    return refresAllTokensResponse;
}