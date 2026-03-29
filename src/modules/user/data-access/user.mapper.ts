import type {UserCreateInput, UserInclude, UserWhereInput} from "../../../generated/prisma/models/User.ts";
import type {UserFilters} from "../user.schema.ts";
import type {CreatePayload, IncludedUserRelations} from "../domain/user.repository.contract.ts";


//Маппер для перетворення фільтрів користувача на обєкт UserWhereInput
export const toUserWhereInput = (userFilters: UserFilters): UserWhereInput => {
    const where: UserWhereInput = {
        id: userFilters.id,
        firstname: userFilters.firstname ? { contains: userFilters.firstname, mode: 'insensitive' } : undefined,
        lastname: userFilters.lastname ? { contains: userFilters.lastname, mode: 'insensitive' } : undefined,
        role: userFilters.roles ? { in: userFilters.roles } : undefined,
    }

    return where;
}

//Маппер для перетворення контракту CreatePayload до обєкту UserCreateInput
export const toUserCreateInput = (payload: CreatePayload): UserCreateInput => {
    const data: UserCreateInput = {
        ...payload,
        address: {
            create: payload.address // Явне перетворення реляції
        }
    }

    return data;
};


export const toUserInclude = (relations: IncludedUserRelations): UserInclude => {
   const include: UserInclude = {
       address: relations.address ?? false,
       //orders: relations.orders ?? false,
   }


    return include;
};