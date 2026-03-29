import {
    type CreateUserDto,
    type CreateUserResponse, createUserResponseSchema,
    type FetchAuthUserResponse,
    fetchAuthUserResponseSchema, type FetchUserByIdResponse, fetchUserByIdResponseSchema, type GetUsersListQuery,
    type GetUsersListResponse, getUsersListResponseSchema
} from "./user.dto.ts";
import type {CreateUserPayload, GetUsersListOptions, GetUsersListResult} from "../domain/user.contract.ts";
import type {UserEntity, UserFull} from "../domain/user.entity.ts";




export const toCreateUserPayload =
    (createUserDto: CreateUserDto): CreateUserPayload => {
        const createUserPayload: CreateUserPayload = {
            ...createUserDto,
            //додаткові поля, або змінені поля, якщо контракт dto відрізняється від контракту сервісу
        }

        return createUserPayload;
    }

export const toCreateUserResponse =
    (user: UserFull): CreateUserResponse => {
        const transformedUser = {
            ...user,
            //додаткові поля, або змінені поля, якщо контракт сервісу відрізняється від контракту response
        }

        const createUserResponse: CreateUserResponse = createUserResponseSchema.parse(transformedUser)

        return createUserResponse;
    }




export const toFetchAuthUserResponse =
    (user: UserFull): FetchAuthUserResponse => {
        const transformedUser = {
            ...user,
            //додаткові поля, або змінені поля, якщо контракт сервісу відрізняється від контракту response
        }

        const fetchAuthUserResponse: FetchAuthUserResponse = fetchAuthUserResponseSchema.parse(transformedUser);

        return fetchAuthUserResponse
    }




export const toFetchUserByIdResponse =
    (user: UserEntity): FetchUserByIdResponse => {
        const transformedUser = {
            ...user,
            //додаткові поля, або змінені поля, якщо контракт сервісу відрізняється від контракту response
        }

        const fetchUserByIdResponse: FetchUserByIdResponse = fetchUserByIdResponseSchema.parse(transformedUser);

        return fetchUserByIdResponse;
    }




export const toGetUsersListOptions =
    (getUsersListQuery: GetUsersListQuery): GetUsersListOptions => {
        const getUsersListOptions: GetUsersListOptions = {
            ...getUsersListQuery,
            //додаткові поля, або змінені поля, якщо контракт query відрізняється від контракту сервісу
        }

        return getUsersListOptions;
    }

export const toGetUsersListResponse =
    (getUsersListResult: GetUsersListResult): GetUsersListResponse => {
        const transformedResult = {
            ...getUsersListResult,
            //додаткові поля, або змінені поля, якщо контракт сервісу відрізняється від контракту response
        }

        const GetUserslistResponse: GetUsersListResponse = getUsersListResponseSchema.parse(transformedResult);

        return GetUserslistResponse;
    }