import {z} from "zod";



//Тип для параметрів пагінації (для шару domain і api)
export const paginationCriteriaSchema = z.object({
    pageNo: z.coerce.number().int().nonnegative().default(0),
    pageSize: z.coerce.number().int().positive().default(10),
    sortOrder: z.enum(["asc", "desc"]).default("asc")
});
export interface PaginationCriteria extends z.infer<typeof paginationCriteriaSchema> {}



//Тип для результатів пагінації (для шару domain і api)
export const paginationMetaSchema = z.object({
    pageNo: z.number().int().nonnegative(),
    pageSize: z.number().int().positive(),
    totalElements: z.number().int().nonnegative(),
    totalPages: z.number().int().positive(),
    last: z.boolean(),
});
export interface PaginationMeta extends z.infer<typeof paginationMetaSchema> {}




