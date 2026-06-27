import type {IUserService} from "../application/user.service.contract";
import type {Request, Response} from "express";
import {
    extractTokenPayloadOrThrow, extractValidatedBodyOrThrow, extractValidatedParamsOrThrow, extractValidatedQueryOrThrow
} from "../../../api/helpers/http.helpers";
import type {
    CreateUserDto,
    UpdateUserDto,
    UserFullResponse, UserParams,
    UserResponse,
    UsersQuery,
    UsersResponse
} from "./user.dto";
import type {TokenPayload} from "../../../shared/schemas/token-payload.schema";




interface Dependencies {
    userService: IUserService;
}

export class UserController {
    private readonly userService: IUserService;

    constructor({userService}: Dependencies) {
        this.userService = userService;
    }

    findById = async (req: Request, res: Response<UserResponse>): Promise<void> => {
        const {id} = extractValidatedParamsOrThrow<UserParams>(req);

        const response: UserResponse = await this.userService.findById(id);

        res.json(response);
    }

    findFullById = async (req: Request, res: Response<UserFullResponse>): Promise<void> => {
        const tokenPayload: TokenPayload = extractTokenPayloadOrThrow(req);

        const response: UserFullResponse = await this.userService.findFullById(tokenPayload.id);

        res.json(response);
    }

    findMany = async (req: Request, res: Response<UsersResponse>): Promise<void> => {
        const query: UsersQuery = extractValidatedQueryOrThrow<UsersQuery>(req);

        const response: UsersResponse = await this.userService.findMany(query);

        res.json(response);
    }

    create = async (req: Request, res: Response<UserFullResponse>): Promise<void> => {
        const dto: CreateUserDto = extractValidatedBodyOrThrow<CreateUserDto>(req);

        const response: UserFullResponse = await this.userService.create(dto);

        res.json(response);
    }

    update = async (req: Request, res: Response<UserFullResponse>): Promise<void> => {
        const {id} = extractValidatedParamsOrThrow<UserParams>(req);
        const dto: UpdateUserDto = extractValidatedBodyOrThrow<UpdateUserDto>(req);

        const response: UserFullResponse = await this.userService.update(id, dto);

        res.json(response);
    }

    delete = async (req: Request, res: Response<UserFullResponse>): Promise<void> => {
        const {id} = extractValidatedParamsOrThrow<UserParams>(req);

        const response: UserFullResponse = await this.userService.delete(id);

        res.json(response);
    }
}