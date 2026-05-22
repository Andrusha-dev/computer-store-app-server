import {Prisma} from "@prisma/client";
import type {CreateUserDto, UpdateUserDto, UserFilters, UsersQuery} from "../api/user.dto.ts";





//Маппер для перетворення фільтрів користувача на обєкт UserWhereInput
export const toUserWhereInput =
    (userFilters: UserFilters): Prisma.UserWhereInput => {
        const where: Prisma.UserWhereInput = {
            firstname: userFilters.firstname
                ? { contains: userFilters.firstname, mode: 'insensitive' }
                : undefined,
            lastname: userFilters.lastname
                ? { contains: userFilters.lastname, mode: 'insensitive' }
                : undefined,
            role: userFilters.roles
                ? { in: userFilters.roles }
                : undefined,
        }

        return where;
    }

export const toUserFindManyArgs =
    (query: UsersQuery): Prisma.UserFindManyArgs => {
        const {sortType, sortOrder, pageNo, pageSize, ...filters} = query;

        const where: Prisma.UserWhereInput = toUserWhereInput(filters);

        const args: Prisma.UserFindManyArgs = {
            where: where,
            orderBy: {
                [sortType]: sortOrder
            },
            take: pageSize,
            skip: pageNo * pageSize,
        }

        return args;
    }


//Маппер для перетворення UserCreateDto на обєкт UserCreateInput
export const toUserCreateInput =
    (dto: CreateUserDto): Prisma.UserCreateInput => {
        const {address, ...rest} = dto;

        const data: Prisma.UserCreateInput = {
            ...rest,
            address: {
                create: address // id присвоїться таке ж, як і в User
            },
            cart: {
                create: {} // id присвоїться таке ж, як і в User
            }
        }

        return data;
    }

export const toUserUpdateInput =
    (dto: UpdateUserDto): Prisma.UserUpdateInput => {
        const {address, ...rest} = dto;

        const data: Prisma.UserUpdateInput = {
            ...rest,
            //Обовязково робимо перевірку на undefined, інакше update: undefined викличе помилку
            address: address ?
                {update: address}
                : undefined
        }

        return data;
    }