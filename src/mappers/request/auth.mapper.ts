import type {LoginRequest, RefreshAllTokensRequest} from "../../types/dto/authDTO.types.ts";
import type {LoginArgs, RefreshAllTokensArgs} from "../../types/services/args/auth.args.ts";

export const toLoginArgs = (loginRequest: LoginRequest): LoginArgs => {
    const loginArgs: LoginArgs = {
        email: loginRequest.email,
        password: loginRequest.password
    }

    return loginArgs;
}

export const toRefreshAllTokensArgs = (refreshAllTokensrequest: RefreshAllTokensRequest): RefreshAllTokensArgs => {
    const refreshAllTokensArgs: RefreshAllTokensArgs = {
        refreshToken: refreshAllTokensrequest.refreshToken
    }

    return refreshAllTokensArgs;
}