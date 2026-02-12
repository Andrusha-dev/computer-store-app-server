import {z} from "zod";
import {pcComponentSortTypeSchema} from "../../models/pcComponents/pcComponent.types.ts";
import {userSortTypeSchema} from "../../models/custom/user.model.ts";



//Загальний тип для сортування. При формування обєкту з параметрами сторінки - буде передаватись
// більш вузькоспеціалізований тип, залежно від сутності, яка сортується (ProcessorSortType, UserSortType і т.д.)
export const sortTypeSchema = z.union([userSortTypeSchema, pcComponentSortTypeSchema]);
export type SortType = z.infer<typeof sortTypeSchema>

export const sortOrderSchema = z.enum(["asc", "desc"]);
export type SortOrder = z.infer<typeof sortOrderSchema>

export const sortParamsSchema = z.object({
    sortType: sortTypeSchema,
    sortOrder: sortOrderSchema,
});
export type SortParams = z.infer<typeof sortParamsSchema>