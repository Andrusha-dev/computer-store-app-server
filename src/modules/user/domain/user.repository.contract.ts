import type {UserEntity, UserFull} from "./user.entity.ts";
import {Prisma} from "@prisma/client";
import {type UserRole} from "../../../shared/schemas/user-role.schema.ts";
import type {FindManyOptions, FindManyResult} from "../../../shared/types/repository.types.ts";







export interface UserFilters {
    id?: number,
    firstname?: string,
    lastname?: string,
    roles?: UserRole[],
}
export type UserSortType = keyof Pick<UserEntity, "firstname" | "lastname">


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




/*
export interface IncludedUserRelations {
    address?: boolean;
    //orders?: boolean;
}



export interface FindManyOptions extends UserFilters, UserSortType, PaginationCriteria {}
export interface FindManyResult {
    content: UserEntity[];
    roles: UserRole[];
    totalElements: number;
}


export interface CreatePayload extends Omit<BaseUser, "id" | "role"> {
    address: BaseAddress
}

export interface IUserRepository {
    // 1. Одиночні пошуки (мають обидва варіанти)
    findById: (id: number) => Promise<UserEntity | null>;
    findByIdOrThrow: (id: number) => Promise<UserEntity>;

    findFullById: (id: number, relations: IncludedUserRelations) => Promise<UserFull | null>;
    findFullByIdOrThrow: (id: number, relations: IncludedUserRelations) => Promise<UserFull>;

    findByEmail: (email: string) => Promise<UserEntity | null>;
    findByEmailOrThrow: (email: string) => Promise<UserEntity>;

    //Методи для отримання користувача з паролем для перевірки хеша пароля під час автентифікації
    findForAuthByEmail(email: string): Promise<UserAuth | null>;
    findForAuthByEmailOrThrow(email: string): Promise<UserAuth>;

    // 2. Списки (завжди повертають масив, навіть порожній)
    findMany: (options: FindManyOptions) => Promise<FindManyResult>;

    // 3. Мутації (завжди повертають об'єкт, бо помилка - це Exception)
    create: (payload: CreatePayload, relations: IncludedUserRelations) => Promise<UserFull>;
    //update: (id: number, payload: UpdateUserPayload) => Promise<UserFull>;
    //delete: (id: number) => Promise<void>;
}
*/