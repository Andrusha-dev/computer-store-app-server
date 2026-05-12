import type {
    IAuthService
} from "./auth.service.contract.ts";
import {UnauthorizedError} from "../../../shared/error/custom.errors.ts";
import type {IJwtProvider} from "../../../shared/contracts/jwt.contract.ts";
import type {TokenPayload} from "../../../shared/schemas/token-payload.schema.ts";
import type {AuthResponse, LoginDto, RefreshAllTokensDto} from "../api/auth.dto.ts";
import type {IUserService, UserResponse} from "../../user/index.ts";
import {toAuthResponse} from "../api/auth.mapper.ts";






interface Dependencies {
    jwtProvider: IJwtProvider;
    userService: IUserService;
}

export class AuthService implements IAuthService {
    private readonly jwtProvider: IJwtProvider;
    private readonly userService: IUserService;

    constructor({jwtProvider, userService}: Dependencies) {
        this.jwtProvider = jwtProvider;
        this.userService = userService;
    }

    login = async (dto: LoginDto): Promise<AuthResponse> => {
        console.log("Starting checking credentials: ", dto);
        const {email, password} = dto;

        //метод verifyCredentials генерує помилку, якщо email чи пароль не валідні
        const user: UserResponse = await this.userService.verifyCredentials(email, password);

        const payload: TokenPayload = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        const accessToken = this.jwtProvider.signAccess(payload);
        console.log("Starting access token: ", accessToken);
        const refreshToken = this.jwtProvider.signRefresh(payload);

        const response: AuthResponse = toAuthResponse(accessToken, refreshToken);

        return response;
    }


    refreshAllTokens = (dto: RefreshAllTokensDto): AuthResponse => {
        const {refreshToken} = dto;
        const payload = this.jwtProvider.verifyRefresh(refreshToken);
        if(!payload) {
            throw new UnauthorizedError("refresh токен недійсний чи некоректний");
        }

        const newAccessToken = this.jwtProvider.signAccess(payload);
        const newRefreshToken = this.jwtProvider.signRefresh(payload);
        console.log("New access token: ", newAccessToken);
        console.log("new refreshToken: ", newRefreshToken);

        const response: AuthResponse = toAuthResponse(newAccessToken, newRefreshToken);

        return response;
    }
}
