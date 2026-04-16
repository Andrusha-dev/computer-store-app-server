import type {
    AuthenticatedUser,
    UserEntity, UserFull,
} from "../domain/user.entity.ts";
import type {CreateUserDto, GetUsersListQuery} from "../api/user.dto.ts";
import type {FindManyResult} from "../../../shared/types/repository.types.ts";







export interface IUserService {
    createUser: (createUserDto: CreateUserDto) => Promise<UserFull>;
    fetchUserById: (id: number) => Promise<UserEntity>;
    fetchAuthUser: (id: number) => Promise<UserFull>;
    fetchUserByEmail: (email: string) => Promise<UserEntity | null>;
    getUsersList: (getUsersListQuery: GetUsersListQuery) => Promise<FindManyResult<UserEntity>>;
    verifyCredentials: (email: string, password: string) => Promise<AuthenticatedUser | null>
}







/*

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
    fetchUserForAuthByEmail: (email: string) => Promise<UserAuth | null>;
    getUsersList: (getUsersListOptions: GetUsersListOptions) => Promise<GetUsersListResult>;
    verifyCredentials: (email: string, password: string) => Promise<AuthenticatedUser | null>
}
 */