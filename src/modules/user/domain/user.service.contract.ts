import type {
    UserEntity, UserFull,
} from "./user.entity.ts";
import type {PaginationOptions, PaginationResult} from "../../../shared/pagination/domain/pagination.contract.ts";
import type {BaseAddress, BaseUser, UserFilters, UserSortType} from "../user.schema.ts";
import type {UserRole} from "../../../shared/auth/auth.schema.ts";




export interface CreateUserPayload extends Omit<BaseUser, "id" | "role"> {
    address: BaseAddress
}




export interface GetUsersListOptions extends UserFilters, UserSortType, PaginationOptions {}

export interface GetUsersListResult extends PaginationResult {
    content: UserEntity[];
    roles: UserRole[];
}



export interface IUserService {
    createUser: (createUserPayload: CreateUserPayload) => Promise<UserFull>;
    fetchUserById: (id: number) => Promise<UserEntity>;
    fetchAuthUser: (id: number) => Promise<UserFull>;
    getUsersList: (getUsersListOptions: GetUsersListOptions) => Promise<GetUsersListResult>;
}