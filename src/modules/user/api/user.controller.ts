import type {IUserService} from "../application/user.service.contract.ts";
import type {Request, Response} from "express";
import {
    extractTokenPayloadOrThrow,
    extractValidatedBodyOrThrow, extractValidatedParamsOrThrow, extractValidatedQueryOrThrow,
} from "../../../api/helpers/http.helpers.ts";
import type {CreateUserDto, FetchUserByIdParams, GetUsersListQuery} from "./user.dto.ts";
import {
    toCreateUserResponse,
    toFetchAuthUserResponse, toFetchUserByIdResponse, toGetUsersListResponse,
} from "./user.mapper.ts";
import type {IUserController} from "./user.controller.contract.ts";




interface Dependencies {
    userService: IUserService;
}

export class UserController implements IUserController {
    private readonly userService: IUserService;

    constructor({userService}: Dependencies) {
        this.userService = userService;
    }

    register = async (req: Request, res: Response) => {
        const dto = extractValidatedBodyOrThrow<CreateUserDto>(res);
        //const payload = toCreateUserPayload(dto);
        const user = await this.userService.createUser(dto);
        const response = toCreateUserResponse(user);

        return res.json(response);
    }


    me = async (req: Request, res: Response) => {
        //після успішної автентифікації через middleware authenticateToken payload вхідного jwt-токена передається в res.locals.payload
        console.log(" Starting FetchAuthUserResult");
        const tokenPayload = extractTokenPayloadOrThrow(res);
        const user = await this.userService.fetchAuthUser(tokenPayload.id);
        const response = toFetchAuthUserResponse(user);

        return res.json(response);
    }

    // GET /api/users/:id -> Отримання за ID
    show = async (req: Request, res: Response) => {
        const {id} = extractValidatedParamsOrThrow<FetchUserByIdParams>(res);
        const user = await this.userService.fetchUserById(id);
        const response = toFetchUserByIdResponse(user);

        return res.json(response);
    };


    index = async (req: Request, res: Response) => {
        //Після валідації за допомогою middleware validate() звалідовані параметри запиту FetchUsersParams передаються в res.locals
        const query = extractValidatedQueryOrThrow<GetUsersListQuery>(res);
        const result = await this.userService.getUsersList(query);
        const response = toGetUsersListResponse(result);

        return res.json(response);
    }
}