import {
    pageQueryParamsSchema,
} from "../pageParams/pageParams.types.ts";
import {z} from "zod";
import {arrayPreprocess} from "../../../utils/validation/validation.ts";
import {userRoleSchema} from "../../models/custom/user.model.ts";



/*userFiltersSchema відрізняється від аналогічної на клієнті, тому що параметри запиту на сервері парсяться
не в обєкт типу GetUsersListParams, а в Record<string, any>, тому схема валідації мусить попередньо обробляти
поля, які є масивами за допомогою z.preprocess()*/
export const userFiltersSchema = z.object({
    id: z.coerce.number().int().positive().optional(),
    firstname: z.coerce.string().optional(),
    lastname: z.coerce.string().optional(),
    roles: z.preprocess(arrayPreprocess, z.array(userRoleSchema)).optional()
});
export type UserFilters = z.infer<typeof userFiltersSchema>

//Обєднаний тип, на основі ключів інтерфейса UserFilters
export type UserFiltersKeys = keyof UserFilters;



//Тип для параметрів запиту після валідації на сервері. Містить обовязкові поля пагінації та сортування
//export const getUsersListParamsSchema = userFiltersSchema.extend(pageParamsSchema.shape);
//export type GetUsersListParams = z.infer<typeof getUsersListParamsSchema>;

//Тип для параметрів запиту. Всі поля є опціональними
export const getUsersListQueryParamsSchema = userFiltersSchema.extend(pageQueryParamsSchema.shape);
export type GetUsersListQueryParams = z.infer<typeof getUsersListQueryParamsSchema>