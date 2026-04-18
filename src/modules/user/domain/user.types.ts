import type {UserEntity} from "./user.entity.ts";
import type {UserRole} from "../../../shared/schemas/user-role.schema.ts";

//ТУТ ЗНАХОДЯТЬСЯ БІЗНЕС ТИПИ, ЯКІ НЕ Є СУТНОСТЯМИ

export interface UserFilters {
    id?: number,
    firstname?: string,
    lastname?: string,
    roles?: UserRole[],
}

export type UserSortType = keyof Pick<UserEntity, "firstname" | "lastname">