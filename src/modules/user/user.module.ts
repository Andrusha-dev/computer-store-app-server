import type {IUserRepository} from "./domain/user.repository.contract";
import type {IUserService} from "./application/user.service.contract";
import {asClass, asFunction} from "awilix";
import {UserRepository} from "./infrastructure/database/user.repository";
import {UserService} from "./application/user.service";
import {UserController} from "./api/user.controller";
import {createUserRouter, type UserRouter} from "./api/user.router";




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



