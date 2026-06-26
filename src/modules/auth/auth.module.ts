import type {IAuthService} from "./application/auth.service.contract.ts";
import {asClass, asFunction} from "awilix";
import {AuthService} from "./application/auth.service.ts";
import {AuthController} from "./api/auth.controller.ts";
import {type AuthRouter, createAuthRouter} from "./api/auth.router.ts";



export interface IAuthModuleCradle {
    authService: IAuthService;
    authController: AuthController;
    authRouter: AuthRouter;
}


export const authModuleDeps = {
    authService: asClass(AuthService).singleton(),
    authController: asClass(AuthController).singleton(),
    authRouter: asFunction(createAuthRouter).singleton(),
}