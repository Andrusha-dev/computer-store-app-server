import {z} from "zod";



export const paginationQuerySchema = z.object({
    pageNo: z.coerce.number().int().nonnegative().default(0),
    pageSize: z.coerce.number().int().positive().default(10),
    sortOrder: z.enum(["asc", "desc"]).default("asc")
});
//export interface PaginationQuery extends z.infer<typeof paginationQuerySchema> {}

export const paginationResponseSchema = z.object({
    pageNo: z.number().int().nonnegative(),
    pageSize: z.number().int().positive(),
    totalElements: z.number().int().nonnegative(),
    totalPages: z.number().int().positive(),
    last: z.boolean(),
});
//export interface PaginationResponse extends z.infer<typeof paginationResponseSchema> {}