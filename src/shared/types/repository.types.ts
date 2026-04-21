import type {PaginationMeta} from "../schemas/pagination.schema.ts";



export interface FindManyResult<T> {
    content: T[];
    meta: PaginationMeta;
}