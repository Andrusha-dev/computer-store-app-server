import {z} from "zod";


export const paginationResponseSchema = z.object({
    pageNo: z.number().nonnegative(),
    pageSize: z.number().positive(),
    totalElements: z.number().nonnegative(),
    totalPages: z.number().nonnegative(),
    last: z.boolean().optional(),
});
export interface PaginationResponse extends z.infer<typeof paginationResponseSchema>{}