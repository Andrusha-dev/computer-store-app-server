import prisma from "../lib/prisma.ts";
import {
    type UserRole, type UserWithAddress, userWithAddressSchema
} from "../types/models/custom/user.model.ts";
import type {UserWithRelations} from "../types/models/generated";
import type {UserWhereInput} from "../generated/prisma/models/User.ts";
import {
    type GetUsersListResult
} from "../types/services/results/user.results.ts";
import type {CreateUserArgs, GetUsersListArgs} from "../types/services/args/user.args.ts";
import {toUserWhereInput} from "../mappers/db/user.db.mapper.ts";



export const createUser = async (createUserArgs: CreateUserArgs): Promise<UserWithAddress> => {
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

    const userWithAddress: UserWithAddress = userWithAddressSchema.parse(createdUser);


    return userWithAddress;
}

//сервісний метод для отримання даних поточного автентифікованого користувача типу FetchAuthUserResponse
export const fetchAuthUser = async (id: number): Promise<UserWithAddress> => {
    const fetchedUser: UserWithRelations = await prisma.user.findUniqueOrThrow({
        where: {
            id: id
        },
        include: {
            address: true
        }
    });


    const userWithAddress: UserWithAddress = userWithAddressSchema.parse(fetchedUser);


    return userWithAddress;
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


    const paginatedUsersWithAddress = paginatedUsers.map(user => {
        const userWithAddress: UserWithAddress = userWithAddressSchema.parse(user);

        return userWithAddress;
    });


    const totalElements: number = await prisma.user.count({ where });
    const pageNo: number = pageParams.pageNo;
    const pageSize: number = pageParams.pageSize;
    const roles: UserRole[] = userFilters.roles ? userFilters.roles : [];



    const getUsersListResult: GetUsersListResult = {
        content: paginatedUsersWithAddress,
        totalElements: totalElements,
        pageNo: pageNo,
        pageSize: pageSize,
        roles: roles
    }

    return getUsersListResult;
}
