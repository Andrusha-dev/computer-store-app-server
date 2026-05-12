import type {Request, Response} from "express";
import type {IAuthService} from "../application/auth.service.contract.ts";
import {extractValidatedBodyOrThrow} from "../../../api/helpers/http.helpers.ts";
import type {LoginDto, RefreshAllTokensDto} from "./auth.dto.ts";
import type {IAuthController} from "./auth.controller.contract.ts";




interface Dependencies {
    authService: IAuthService;
}

export class AuthController implements IAuthController {
    private readonly authService: IAuthService;

    constructor({authService}: Dependencies) {
        this.authService = authService;
    }

    login = async (req: Request, res: Response): Promise<void> => {
        console.log("starting login");
        const dto = extractValidatedBodyOrThrow<LoginDto>(res);
        console.log("LoginDto", dto)
        const response = await this.authService.login(dto);

        res.json(response);
    }

    refresh = async (req: Request, res: Response): Promise<void> => {
        const dto = extractValidatedBodyOrThrow<RefreshAllTokensDto>(res);

        const response = this.authService.refreshAllTokens(dto);

        res.json(response);
    }

}