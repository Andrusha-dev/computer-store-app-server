import {Prisma} from "@prisma/client";
import type {CreateUserDto} from "../../api/user.dto.ts";
import type {UserFilters} from "../../domain/user.repository.contract.ts";




//Маппер для перетворення контракту CreatePayload до обєкту UserCreateInput
export const toUserCreateInput = (createUserDto: CreateUserDto): Prisma.UserCreateInput => {
    const data: Prisma.UserCreateInput = {
        ...createUserDto,
        address: {
            create: createUserDto.address // Явне перетворення реляції
        }
    }

    return data;
};



//Маппер для перетворення фільтрів користувача на обєкт UserWhereInput
export const toUserWhereInput = (userFilters: UserFilters): Prisma.UserWhereInput => {
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