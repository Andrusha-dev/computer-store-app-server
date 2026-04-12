import type {IUserRepository} from "./domain/user.repository.contract.ts";
import type {IUserService} from "./application/user.service.contract.ts";
import type {IUserController} from "./api/user.controller.contract.ts";
import type {IRouter} from "../../shared/contracts/router.contract.ts";
import {asClass} from "awilix";
import {UserRepository} from "./infrastructure/database/user.repository.ts";
import {UserService} from "./application/user.service.ts";
import {UserController} from "./api/user.controller.ts";
import {UserRouter} from "./api/user.router.ts";




export interface IUserModuleCradle {
    userRepository: IUserRepository;
    userService: IUserService;
    userController: IUserController;
    userRouter: IRouter;
}


export const userModuleDeps = {
    userRepository: asClass(UserRepository).singleton(),
    userService: asClass(UserService).singleton(),
    userController: asClass(UserController).singleton(),
    userRouter: asClass(UserRouter).singleton(),
}



