import type {Request, Response} from "express";
import type {IAuthService} from "../application/auth.service.contract.ts";
import {extractValidatedBodyOrThrow} from "../../../api/helpers/http.helpers.ts";
import type {LoginDto, RefreshAllTokensDto} from "./auth.dto.ts";
import {toLoginPayload, toLoginResponse, toRefreshAllTokensPayload, toRefreshAllTokensResponse} from "./auth.mapper.ts";
import type {IAuthController} from "./auth.controller.contract.ts";




interface Dependencies {
    authService: IAuthService;
}

export class AuthController implements IAuthController {
    private readonly authService: IAuthService;

    constructor({authService}: Dependencies) {
        this.authService = authService;
    }

    login = async (req: Request, res: Response) => {
        console.log("starting login");
        const dto = extractValidatedBodyOrThrow<LoginDto>(res);
        console.log("LoginDto", dto)
        const payload = toLoginPayload(dto);
        const result = await this.authService.login(payload);
        const response = toLoginResponse(result);

        return res.json(response);
    }

    refresh = async (req: Request, res: Response) => {
        const dto = extractValidatedBodyOrThrow<RefreshAllTokensDto>(res);
        const payload = toRefreshAllTokensPayload(dto)
        const result = this.authService.refreshAllTokens(payload);
        const response = toRefreshAllTokensResponse(result);

        return res.json(response);
    }

}