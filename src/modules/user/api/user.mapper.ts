import {
    type UserFullResponse, userFullResponseSchema,
    type UserListResponse, userListResponseSchema, type UserResponse, userResponseSchema,
} from "./user.dto.ts";
import type {UserEntity, UserFull} from "../domain/user.entity.ts";
import type {FindManyResult} from "../../../shared/types/repository.types.ts";





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
    (user: UserFull): UserFullResponse => {
        const transformedUser = {
            //Деструктуризація без ручного маппінгу разом з лишніми полями (password, addressId)
            ...user,
            //додаткові поля, або змінені поля, якщо контракт репозиторію відрізняється від контракту response
        }

        //Після валідації лишні поля (password, addressId) відсіються
        const userFullResponse: UserFullResponse = userFullResponseSchema.parse(transformedUser)

        return userFullResponse;
    }





export const toUserListResponse =
    (findManyResult: FindManyResult<UserEntity>): UserListResponse => {
        const {content, meta} = findManyResult;


        const response: UserListResponse = {
            content: content.map(user => ({
                //Деструктуризація без ручного маппінгу разом з лишніми полями (password)
                ...user,
                //додаткові поля, або змінені поля, якщо контракт репозиторію відрізняється від контракту response
            })),
            //meta з findManyResult і з GetUsersListResponse мають однаковий тип,
            //тому передаємо його без мапінга
            meta: meta
        };

        //Після валідації лишні поля (password, addressId) відсіються
        const validatedResponse: UserListResponse = userListResponseSchema.parse(response);

        return validatedResponse;
    }
