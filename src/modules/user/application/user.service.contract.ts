import type {
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
    verifyCredentials: (email: string, password: string) => Promise<UserEntity | null>
}







