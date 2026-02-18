import type {UserFilters} from "../../types/params/userParams/userParams.types.ts";
import type {UserWhereInput} from "../../generated/prisma/models/User.ts";

export const toUserWhereInput = (userFilters: UserFilters): UserWhereInput => {
    const where: UserWhereInput = {
        id: userFilters.id,
        firstname: userFilters.firstname ? { contains: userFilters.firstname, mode: 'insensitive' } : undefined,
        lastname: userFilters.lastname ? { contains: userFilters.lastname, mode: 'insensitive' } : undefined,
        role: userFilters.roles ? { in: userFilters.roles } : undefined,
    }

    return where;
}