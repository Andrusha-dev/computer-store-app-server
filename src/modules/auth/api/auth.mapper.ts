import type {LoginDto, LoginResponse, RefreshAllTokensDto, RefreshAllTokensResponse} from "./auth.dto.ts";
import type {
    LoginPayload,
    LoginResult,
    RefreshAllTokensPayload,
    RefreshAllTokensResult
} from "../application/auth.service.contract.ts";






export const toLoginPayload = (loginDto: LoginDto): LoginPayload => {
    const loginPayload: LoginPayload = {
        email: loginDto.email,
        password: loginDto.password,
    }

    return loginPayload;
}

export const toLoginResponse = (loginResult: LoginResult): LoginResponse => {
    const LoginResponse: LoginResponse = {
        accessToken: loginResult.accessToken,
        refreshToken: loginResult.refreshToken,
    }

    return LoginResponse;
}



export const toRefreshAllTokensPayload = (refreshAllTokensDto: RefreshAllTokensDto): RefreshAllTokensPayload => {
    const refreshAllTokensPayload: RefreshAllTokensPayload = {
        refreshToken: refreshAllTokensDto.refreshToken,
    }

    return refreshAllTokensPayload;
}

export const toRefreshAllTokensResponse = (refreshAllTokensResult: RefreshAllTokensResult): RefreshAllTokensResponse => {
    const refreshAllTokensResponse: RefreshAllTokensResponse = {
        accessToken: refreshAllTokensResult.accessToken,
        refreshToken: refreshAllTokensResult.refreshToken,
    }

    return refreshAllTokensResponse;
}