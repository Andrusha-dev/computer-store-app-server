import {
    type UserFullResponse, userFullResponseSchema,
    type UserResponse, userResponseSchema, type UsersResponse, usersResponseSchema,
} from "./user.dto";
import type {UserEntity, UserFullEntity} from "../domain/user.entity";
import type {PaginationMeta} from "../../../shared/schemas/pagination.schema";





export const toUserResponse =
    (user: UserEntity): UserResponse => {
        const transformedUser = {
            //Деструктуризація без ручного маппінгу разом з лишніми полями (password, addressId)
            ...user,
            //додаткові поля, або змінені поля, якщо контракт репозиторію відрізняється від контракту response
        }

        //Після валідації лишні поля (password, addressId) відсіються
        const userResponse: UserResponse = userResponseSchema.parse(transformedUser);

        return userResponse;
    }


export const toUserFullResponse =
    (user: UserFullEntity): UserFullResponse => {
        const transformedUser = {
            //Деструктуризація без ручного маппінгу разом з лишніми полями (password, addressId)
            ...user,
            //додаткові поля, або змінені поля, якщо контракт репозиторію відрізняється від контракту response
        }

        //Після валідації лишні поля (password, addressId) відсіються
        const userFullResponse: UserFullResponse = userFullResponseSchema.parse(transformedUser)

        return userFullResponse;
    }


export const toUsersResponse =
    (content: UserResponse[], meta: PaginationMeta): UsersResponse => {
        const response: UsersResponse = {
            content: content,
            meta: meta
        };

        //Після валідації лишні поля (password, addressId) відсіються
        const validatedResponse: UsersResponse = usersResponseSchema.parse(response);

        return validatedResponse;
    }
