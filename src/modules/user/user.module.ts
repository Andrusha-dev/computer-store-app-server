import type {IUserRepository} from "./domain/user.repository.contract.ts";
import type {IUserService} from "./application/user.service.contract.ts";
import {asClass, asFunction} from "awilix";
import {UserRepository} from "./infrastructure/database/user.repository.ts";
import {UserService} from "./application/user.service.ts";
import {UserController} from "./api/user.controller.ts";
import {createUserRouter, type UserRouter} from "./api/user.router.ts";




export interface IUserModuleCradle {
    userRepository: IUserRepository;
    userService: IUserService;
    userController: UserController;
    userRouter: UserRouter;
}


export const userModuleDeps = {
    userRepository: asClass(UserRepository).singleton(),
    userService: asClass(UserService).singleton(),
    userController: asClass(UserController).singleton(),
    userRouter: asFunction(createUserRouter).singleton(),
}



