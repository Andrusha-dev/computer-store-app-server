import type {
    IAuthService
} from "./auth.service.contract.ts";
import {UnauthorizedError} from "../../../shared/error/custom.errors.ts";
import type {IJwtProvider} from "../../../shared/contracts/jwt.contract.ts";
import type {TokenPayload} from "../../../shared/schemas/token-payload.schema.ts";
import type {IUserService} from "../../user/application/user.service.contract.ts";
import type {LoginDto, RefreshAllTokensDto} from "../api/auth.dto.ts";
import type {AuthTokens} from "../domain/auth.types.ts";






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

    login = async (loginDto: LoginDto): Promise<AuthTokens> => {
        console.log("Starting checking credentials: ", loginDto);
        const {email, password} = loginDto;

        const authenticatedUser = await this.userService.verifyCredentials(email, password);
        if (!authenticatedUser) {
            //Кажемо, що невірний email або пароль, що зловмисник не знав в чому саме причина
            throw new UnauthorizedError("Невірний email або пароль");
        }

        const payload: TokenPayload = {
            id: authenticatedUser.id,
            email: authenticatedUser.email,
            role: authenticatedUser.role
        };

        const accessToken = this.jwtProvider.signAccess(payload);
        console.log("Starting access token: ", accessToken);
        const refreshToken = this.jwtProvider.signRefresh(payload);

        const authTokens: AuthTokens = {
            accessToken,
            refreshToken,
        }

        return authTokens;
    }


    refreshAllTokens = (refreshAllTokensDto: RefreshAllTokensDto): AuthTokens => {
        const {refreshToken} = refreshAllTokensDto;
        const payload = this.jwtProvider.verifyRefresh(refreshToken);
        if(!payload) {
            throw new UnauthorizedError("refresh токен недійсний чи некоректний");
        }


        const newAccessToken: string = this.jwtProvider.signAccess(payload);
        const newRefreshToken: string = this.jwtProvider.signRefresh(payload);
        console.log("New access token: ", newAccessToken);
        console.log("new refreshToken: ", refreshToken);

        const authTokens: AuthTokens = {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }


        return authTokens;
    }
}
