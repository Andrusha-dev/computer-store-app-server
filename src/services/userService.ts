import {
    type CreateUserRequest
} from "../types/dto/userDTO.types.ts";
//import type {ParsedUsersParams, UserFilters} from "../types/params/userParams/userParams.types.ts";
//import type {PageParams} from "../types/params/pageParams/pageParams.types.ts";
import prisma from "../lib/prisma.ts";
import type {UserRole} from "../types/models/custom/user.model.ts";
import type {UserWithRelations} from "../types/models/generated";
import {AppError} from "../error/appError.ts";
import type {UserWhereInput} from "../generated/prisma/models/User.ts";
import type {
    CreateUserResult,
    FetchAuthUserResult,
    GetUsersListResult
} from "../types/services/results/user.results.ts";
import type {CreateUserArgs, FetchAuthUserArgs, GetUsersListArgs} from "../types/services/args/user.args.ts";
import {toUserWhereInput} from "../mappers/db/user.db.mapper.ts";



export const createUser = async (createUserArgs: CreateUserArgs): Promise<CreateUserResult> => {
    const {address, ...userData} = createUserArgs;

    console.log("userData: ", userData);


    //тип UserWithRelations згенерований prisma
    const createdUser: UserWithRelations = await prisma.user.create({
        data: {
            ...userData,
            address: {
                create: address
            }
        },
        include: {
            address: true
        }
    });

    console.log("resUser: ", createdUser);

    if(!createdUser.address) {
        throw new AppError({
            message: "Даних з адресою поточного користувача не знайдено",
            code: "NOT_FOUND",
            statusCode: 404
        })
    }

    const createUserResult: CreateUserResult = {
        userWithRelations: createdUser
    }

    return createUserResult;
}

//сервісний метод для отримання даних поточного автентифікованого користувача типу FetchAuthUserResponse
export const fetchAuthUser = async (fetchAuthUsersArgs: FetchAuthUserArgs/*id: number*/): Promise<FetchAuthUserResult/*UserWithRelations*/> => {
    const fetchedUser: UserWithRelations = await prisma.user.findUniqueOrThrow({
        where: {
            id: fetchAuthUsersArgs.id
        },
        include: {
            address: true
        }
    });

    if(!fetchedUser.address) {
        throw new AppError({
            message: "Даних з адресою поточного користувача не знайдено",
            code: "NOT_FOUND",
            statusCode: 404
        })
    }

    const fetchAuthUserResult: FetchAuthUserResult = {
        userWithRelations: fetchedUser
    }

    return fetchAuthUserResult;
}


export const getUsersList = async (getUsersListArgs: GetUsersListArgs): Promise<GetUsersListResult> => {
    const {userFilters, pageParams} = getUsersListArgs;

    const where: UserWhereInput = toUserWhereInput(userFilters);

    const paginatedUsers: UserWithRelations[] = await prisma.user.findMany({
        where,
        include: { address: true },
        orderBy: {
            [pageParams.sortType]: pageParams.sortOrder
        },
        take: pageParams.pageSize,
        skip: pageParams.pageNo * pageParams.pageSize,
    });

    const totalElements: number = await prisma.user.count({ where });
    const pageNo: number = pageParams.pageNo;
    const pageSize: number = pageParams.pageSize;
    const roles: UserRole[] = userFilters.roles ? userFilters.roles : [];



    const getUsersListResult: GetUsersListResult = {
        paginatedUsers: paginatedUsers,
        totalElements: totalElements,
        pageNo: pageNo,
        pageSize: pageSize,
        roles: roles
    }

    return getUsersListResult;
}
