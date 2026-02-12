import type {UserFilters} from "../../params/userParams/userParams.types.ts";
import type {PageParams} from "../../params/pageParams/pageParams.types.ts";
import type {BaseUser} from "../../models/custom/user.model.ts";

export type CreateUserArgs = Omit<BaseUser, "id" | "role">;

export type FetchAuthUserArgs = {
    id: number;
}

export type GetUsersListArgs = {
    userFilters: UserFilters;
    pageParams: PageParams;
}

