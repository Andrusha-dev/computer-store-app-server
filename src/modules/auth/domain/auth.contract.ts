//import type {TokenPayload} from "../../../shared/auth/auth.schema.ts";


export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResult {
    accessToken: string;
    refreshToken: string;
}


export interface RefreshAllTokensPayload {
    refreshToken: string;
}

export interface RefreshAllTokensResult {
    accessToken: string;
    refreshToken: string;
}


//Повний контракт сервісу для використання в Controller
export interface IAuthService {
    login: (loginPayload: LoginPayload) => Promise<LoginResult>;
    refreshAllTokens: (refreshAllTokensPayload: RefreshAllTokensPayload) => RefreshAllTokensResult;
}



