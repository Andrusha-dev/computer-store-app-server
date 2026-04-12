import type {IAuthService} from "./application/auth.service.contract.ts";
import type {IAuthController} from "./api/auth.controller.contract.ts";
import type {IRouter} from "../../shared/contracts/router.contract.ts";
import {asClass} from "awilix";
import {AuthService} from "./application/auth.service.ts";
import {AuthController} from "./api/auth.controller.ts";
import {AuthRouter} from "./api/auth.router.ts";



export interface IAuthModuleCradle {
    authService: IAuthService;
    authController: IAuthController;
    authRouter: IRouter;
}


export const authModuleDeps = {
    authService: asClass(AuthService).singleton(),
    authController: asClass(AuthController).singleton(),
    authRouter: asClass(AuthRouter).singleton(),
}