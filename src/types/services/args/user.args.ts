import type {UserFilters} from "../../params/userParams/userParams.types.ts";
import type {PageParams} from "../../params/pageParams/pageParams.types.ts";
import {type BaseUser, type BaseUserRelations} from "../../models/custom/user.model.ts";




type CreateUserArgsType = Omit<BaseUser, "id" | "role">
    & Pick<BaseUserRelations, "address">
    & {password: string};
export interface CreateUserArgs extends CreateUserArgsType {}


export interface GetUsersListArgs {
    userFilters: UserFilters;
    pageParams: PageParams;
}

