import {
    type CreateUserResponse, createUserResponseSchema,
    type FetchAuthUserResponse,
    fetchAuthUserResponseSchema, type FetchUserByIdResponse, fetchUserByIdResponseSchema, type GetUsersListResponse,
    getUsersListResponseSchema,
} from "./user.dto.ts";
import type {UserEntity, UserFull} from "../domain/user.entity.ts";
import type {FindManyResult} from "../../../shared/types/repository.types.ts";






export const toCreateUserResponse =
    (user: UserFull): CreateUserResponse => {
        const transformedUser = {
            //Деструктуризація без ручного маппінгу разом з лишніми полями (password, addressId)
            ...user,
            //додаткові поля, або змінені поля, якщо контракт репозиторію відрізняється від контракту response
        }

        //Після валідації лишні поля (password, addressId) відсіються
        const createUserResponse: CreateUserResponse = createUserResponseSchema.parse(transformedUser)

        return createUserResponse;
    }




export const toFetchAuthUserResponse =
    (user: UserFull): FetchAuthUserResponse => {
        const transformedUser = {
            //Деструктуризація без ручного маппінгу разом з лишніми полями (password, addressId)
            ...user,
            //додаткові поля, або змінені поля, якщо контракт репозиторію відрізняється від контракту response
        }

        //Після валідації лишні поля (password, addressId) відсіються
        const fetchAuthUserResponse: FetchAuthUserResponse = fetchAuthUserResponseSchema.parse(transformedUser);

        return fetchAuthUserResponse
    }




export const toFetchUserByIdResponse =
    (user: UserEntity): FetchUserByIdResponse => {
        const transformedUser = {
            //Деструктуризація без ручного маппінгу разом з лишніми полями (password, addressId)
            ...user,
            //додаткові поля, або змінені поля, якщо контракт репозиторію відрізняється від контракту response
        }

        //Після валідації лишні поля (password, addressId) відсіються
        const fetchUserByIdResponse: FetchUserByIdResponse = fetchUserByIdResponseSchema.parse(transformedUser);

        return fetchUserByIdResponse;
    }


export const toGetUsersListResponse =
    (findManyResult: FindManyResult<UserEntity>): GetUsersListResponse => {
        const {content, meta} = findManyResult;


        const response: GetUsersListResponse = {
            content: content.map(user => ({
                //Деструктуризація без ручного маппінгу разом з лишніми полями (password, addressId)
                ...user,
                //додаткові поля, або змінені поля, якщо контракт репозиторію відрізняється від контракту response
            })),
            //meta з findManyResult і з GetUsersListResponse мають однаковий тип,
            //тому передаємо його без мапінга
            meta: meta
        };

        //Після валідації лишні поля (password, addressId) відсіються
        const validatedResponse: GetUsersListResponse = getUsersListResponseSchema.parse(response);

        return validatedResponse;
    }
