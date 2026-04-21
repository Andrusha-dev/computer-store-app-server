import {Prisma} from "@prisma/client";
import type {CreateUserDto, UserFilters} from "../../api/user.dto.ts";





//Маппер для перетворення фільтрів користувача на обєкт UserWhereInput
export const toUserWhereInput =
    (userFilters: UserFilters): Prisma.UserWhereInput => {
        const where: Prisma.UserWhereInput = {
            id: userFilters.id,
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

//Маппер для перетворення UserCreateDto на обєкт UserCreateInput
export const toUserCreateInput =
    (createUserDto: CreateUserDto): Prisma.UserCreateInput => {
        const data: Prisma.UserCreateInput = {
            ...createUserDto,
            address: {
                create: createUserDto.address // Явне перетворення реляції
            }
        }

        return data;
    }