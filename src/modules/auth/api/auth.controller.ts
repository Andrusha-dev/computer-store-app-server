import type {Request, Response} from "express";
import type {IAuthService} from "../application/auth.service.contract.ts";
import type {AuthResponse, LoginDto, RefreshAllTokensDto} from "./auth.dto.ts";
import type {IAuthController} from "./auth.controller.contract.ts";
import {extractValidatedBodyOrThrow} from "../../../api/helpers/http.helpers.ts";




interface Dependencies {
    authService: IAuthService;
}

export class AuthController implements IAuthController {
    private readonly authService: IAuthService;

    constructor({authService}: Dependencies) {
        this.authService = authService;
    }

    login = async (req: Request, res: Response<AuthResponse>): Promise<void> => {
        console.log("starting login");
        const dto: LoginDto = extractValidatedBodyOrThrow<LoginDto>(req);

        console.log("LoginDto", dto)
        const response = await this.authService.login(dto);

        res.json(response);
    }

    refresh = async (req: Request, res: Response<AuthResponse>): Promise<void> => {
        const dto: RefreshAllTokensDto = extractValidatedBodyOrThrow<RefreshAllTokensDto>(req);

        const response = this.authService.refreshAllTokens(dto);

        res.json(response);
    }

}