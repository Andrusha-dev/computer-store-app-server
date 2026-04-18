import type {UserEntity, UserFull} from "./user.entity.ts";
import {Prisma} from "@prisma/client";
import type {FindManyOptions, FindManyResult} from "../../../shared/types/repository.types.ts";
import type {UserFilters, UserSortType} from "./user.types.ts";







export interface IUserRepository {
    // 1. Одиночні пошуки (мають обидва варіанти)
    findById: (id: number) => Promise<UserEntity | null>;
    findByIdOrThrow: (id: number) => Promise<UserEntity>;

    findFullById: (id: number) => Promise<UserFull | null>;
    findFullByIdOrThrow: (id: number) => Promise<UserFull>;

    findByEmail: (email: string) => Promise<UserEntity | null>;
    findByEmailOrThrow: (email: string) => Promise<UserEntity>;


    // 2. Списки (завжди повертають масив, навіть порожній)
    findMany: (options: FindManyOptions<UserFilters, UserSortType>) => Promise<FindManyResult<UserEntity>>;

    // 3. Мутації (завжди повертають об'єкт, бо помилка - це Exception)
    create: (userCreateInput: Prisma.UserCreateInput) => Promise<UserFull>;
    //update: (id: number, payload: UpdateUserPayload) => Promise<UserFull>;
    //delete: (id: number) => Promise<void>;
}