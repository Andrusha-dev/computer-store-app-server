import type {UserEntity, UserFull} from "./user.entity.ts";
import type {FindManyResult} from "../../../shared/types/repository.types.ts";
import type {CreateUserDto, GetUsersListQuery} from "../api/user.dto.ts";






export interface IUserRepository {
    // 1. Одиночні пошуки (мають обидва варіанти)
    findById: (id: number) => Promise<UserEntity | null>;
    findByIdOrThrow: (id: number) => Promise<UserEntity>;

    findFullById: (id: number) => Promise<UserFull | null>;
    findFullByIdOrThrow: (id: number) => Promise<UserFull>;

    findByEmail: (email: string) => Promise<UserEntity | null>;
    findByEmailOrThrow: (email: string) => Promise<UserEntity>;


    // 2. Списки (завжди повертають масив, навіть порожній)
    findMany: (getUsersListQuery: GetUsersListQuery) => Promise<FindManyResult<UserEntity>>;

    // 3. Мутації (завжди повертають об'єкт, бо помилка - це Exception)
    create: (createUserDto: CreateUserDto) => Promise<UserFull>;
    //update: (id: number, payload: UpdateUserPayload) => Promise<UserFull>;
    //delete: (id: number) => Promise<void>;
}