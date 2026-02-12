import {z} from "zod";
import {paginationParamsShema} from "./paginationParams.types.ts";
import {sortParamsSchema} from "./sortParams.types.ts";


//Тип PageParams містить обовязкові поля для використання в бізнес-логіці
export const pageParamsSchema = paginationParamsShema.extend(sortParamsSchema.shape);
export type PageParams = z.infer<typeof pageParamsSchema>

//Тип PageQueryParams містить опціональні поля для запитів
export const pageQueryParamsSchema = pageParamsSchema.partial();
export type PageQueryParams = z.infer<typeof pageQueryParamsSchema>

