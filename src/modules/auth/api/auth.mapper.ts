import type {LoginResponse, RefreshAllTokensResponse} from "./auth.dto.ts";
import type {

} from "../application/auth.service.contract.ts";
import type {AuthTokens} from "../domain/auth.types.ts";




export const toLoginResponse = (authTokens: AuthTokens): LoginResponse => {
    const LoginResponse: LoginResponse = {
        accessToken: authTokens.accessToken,
        refreshToken: authTokens.refreshToken,
    }

    return LoginResponse;
}


export const toRefreshAllTokensResponse = (authTokens: AuthTokens): RefreshAllTokensResponse => {
    const refreshAllTokensResponse: RefreshAllTokensResponse = {
        accessToken: authTokens.accessToken,
        refreshToken: authTokens.refreshToken,
    }

    return refreshAllTokensResponse;
}