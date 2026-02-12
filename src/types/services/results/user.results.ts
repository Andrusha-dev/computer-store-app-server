import type {UserWithRelations} from "../../models/generated";
import type {UserRole} from "../../models/custom/user.model.ts";

export type CreateUserResult = {
    userWithRelations: UserWithRelations;
}

export type FetchAuthUserResult = {
    userWithRelations: UserWithRelations
}

export type GetUsersListResult = {
    paginatedUsers: UserWithRelations[];
    totalElements: number;
    pageNo: number;
    pageSize: number;
    roles?: UserRole[];
}

