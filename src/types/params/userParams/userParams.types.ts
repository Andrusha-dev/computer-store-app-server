import {type PageParams, type QueryPageParams, queryPageParamsSchema, type SortType} from "../pageParams/pageParams.types.ts";
import {type UserRole, userRoleSchema} from "../../models/user.ts";
import {z} from "zod";

//основний тип для фільтрів списку процесорів Processor[] в параметрах запиту
export interface UserFilters {
    id?: number;
    firstname?: string;
    lastname?: string;
    roles?: UserRole[]
}
/*userFiltersSchema відрізняється від аналогічної на клієнті, тому що параметри запиту на сервері парсяться
не в обєкт типу FetchUsersParams, а в Record<string, any>, схема валідації якого відрізнятиметься від схеми валідації
обєкту типу FetchUsersParams*/
export const userFiltersSchema = z.object({
    id: z.number().int().positive().optional(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    roles: z.array(userRoleSchema).optional()
})

//Обєднаний тип, на основі ключів інтерфейса UserFilters
export type UserFiltersKeys = keyof UserFilters;


//Тип, в якому параметри запиту FetchUsersParams, розділені на групи. При чому цей
//тип передбачає властивість типу PageParams, а не QueryPageParams. Тобто наявність пагінації - обовязкова.
// Використовується в методі parseUserParams для парсинга параметрів FetchUsersParams до UserFilters та PageParams
export interface ParsedUsersParams {
    userFilters: UserFilters;
    pageParams: PageParams;
}

export interface GetUsersListParams extends UserFilters, QueryPageParams {}
export const getUsersListParamsSchema = userFiltersSchema.extend(queryPageParamsSchema.shape);