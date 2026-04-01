import type {UserFilters} from "../user.schema.ts";
import type {CreatePayload, IncludedUserRelations} from "../domain/user.repository.contract.ts";
import {Prisma} from "@prisma/client";



//Маппер для перетворення фільтрів користувача на обєкт UserWhereInput
export const toUserWhereInput = (userFilters: UserFilters): Prisma.UserWhereInput => {
    const where: Prisma.UserWhereInput = {
        id: userFilters.id,
        firstname: userFilters.firstname ? { contains: userFilters.firstname, mode: 'insensitive' } : undefined,
        lastname: userFilters.lastname ? { contains: userFilters.lastname, mode: 'insensitive' } : undefined,
        role: userFilters.roles ? { in: userFilters.roles } : undefined,
    }

    return where;
}

//Маппер для перетворення контракту CreatePayload до обєкту UserCreateInput
export const toUserCreateInput = (payload: CreatePayload): Prisma.UserCreateInput => {
    const data: Prisma.UserCreateInput = {
        ...payload,
        address: {
            create: payload.address // Явне перетворення реляції
        }
    }

    return data;
};


export const toUserInclude = (relations: IncludedUserRelations): Prisma.UserInclude => {
   const include: Prisma.UserInclude = {
       address: relations.address ?? false,
       //orders: relations.orders ?? false,
   }


    return include;
};