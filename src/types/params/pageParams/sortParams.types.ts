import {z} from "zod";
import {type UserSortType, userSortTypeSchema} from "../../models/user.ts";
import {type PCComponentSortType, pcComponentSortTypeSchema} from "../../models/pcComponents/pcComponent.types.ts";



//Загальний тип для сортування. При формування обєкту з параметрами сторінки - буде передаватись
// більш вузькоспеціалізований тип, залежно від сутності, яка сортується (ProcessorSortType, UserSortType і т.д.)
export type SortType = UserSortType | PCComponentSortType;
export const sortTypeSchema = z.union([userSortTypeSchema, pcComponentSortTypeSchema]);

export type SortOrder = "asc" | "desc";
export const sortOrderSchema = z.enum(["asc", "desc"]);


export interface SortParams {
    sortType: SortType;
    sortOrder: SortOrder;
}
export const sortParamsSchema = z.object({
    sortType: sortTypeSchema,
    sortOrder: sortOrderSchema,
})