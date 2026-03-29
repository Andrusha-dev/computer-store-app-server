import {paginationCriteriaSchema, paginationMetaSchema} from "../pagination.schema.ts";
import {z} from "zod";



export const paginationQuerySchema = paginationCriteriaSchema;
export interface PaginationQuery extends z.infer<typeof paginationQuerySchema> {}

export const paginationResponseSchema = paginationMetaSchema;
export interface PaginationResponse extends z.infer<typeof paginationResponseSchema> {}