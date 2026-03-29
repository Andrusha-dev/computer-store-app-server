import type {UserAuth, UserEntity, UserFull} from "./user.entity.ts";
import type {BaseAddress, BaseUser, UserFilters, UserSortType} from "../user.schema.ts";
import type {PaginationCriteria} from "../../../shared/pagination/pagination.schema.ts";
import type {UserRole} from "../../../shared/auth/auth.schema.ts";




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