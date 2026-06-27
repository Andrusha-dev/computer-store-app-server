import type {IAuthService} from "./application/auth.service.contract";
import {asClass, asFunction} from "awilix";
import {AuthService} from "./application/auth.service";
import {AuthController} from "./api/auth.controller";
import {type AuthRouter, createAuthRouter} from "./api/auth.router";



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