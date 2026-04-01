import type {
    IAuthService,
    LoginPayload,
    LoginResult,
    RefreshAllTokensPayload,
    RefreshAllTokensResult
} from "./auth.service.contract.ts";
import {type TokenPayload} from "../../../shared/auth/auth.schema.ts";
import type {IUserRepository} from "../../user/domain/user.repository.contract.ts";
import {UnauthorizedError} from "../../../core/errors/custom.errors.ts";
import type {IJwtProvider} from "../../../infrastructure/auth/jwt.contract.ts";
import type {IHashProvider} from "../../../infrastructure/cryptography/hash.contract.ts";




interface Dependencies {
    hashProvider: IHashProvider;
    jwtProvider: IJwtProvider;
    userRepository: IUserRepository;
}

export class AuthService implements IAuthService {
    private readonly hashProvider: IHashProvider;
    private readonly jwtProvider: IJwtProvider;
    private readonly userRepository: IUserRepository;

    constructor({hashProvider, jwtProvider, userRepository}: Dependencies) {
        this.hashProvider = hashProvider;
        this.jwtProvider = jwtProvider;
        this.userRepository = userRepository;
    }

    login = async (loginPayload: LoginPayload): Promise<LoginResult> => {
        console.log("Starting checking credentials: ", loginPayload);
        const {email, password} = loginPayload;

        const user = await this.userRepository.findForAuthByEmailOrThrow(email);

        const isPasswordValid = await this.hashProvider.compare(password, user.password);
        if(!isPasswordValid) {
            throw new UnauthorizedError("Невірний email або пароль");
        }


        const payload: TokenPayload = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        const accessToken = this.jwtProvider.signAccess(payload);
        console.log("Starting access token: ", accessToken);
        const refreshToken = this.jwtProvider.signRefresh(payload);

        const loginResult: LoginResult = {
            accessToken,
            refreshToken,
        }

        return loginResult;
    }


    refreshAllTokens = (refreshAllTokensPayload: RefreshAllTokensPayload): RefreshAllTokensResult => {
        const {refreshToken} = refreshAllTokensPayload;
        const payload = this.jwtProvider.verifyRefresh(refreshToken);
        if(!payload) {
            throw new UnauthorizedError("refresh токен недійсний чи некоректний");
        }


        const newAccessToken: string = this.jwtProvider.signAccess(payload);
        const newRefreshToken: string = this.jwtProvider.signRefresh(payload);
        console.log("New access token: ", newAccessToken);
        console.log("new refreshToken: ", refreshToken);

        const refreshAllTokensResult: RefreshAllTokensResult = {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }


        return refreshAllTokensResult;
    }
}

