import type {PaginationCriteria, PaginationMeta} from "../schemas/pagination.schema.ts";


export interface FindManyOptions<T, V> {
    filters: T;
    sortType: V;
    criteria: PaginationCriteria;
}

export interface FindManyResult<T> {
    content: T[];
    meta: PaginationMeta;
}