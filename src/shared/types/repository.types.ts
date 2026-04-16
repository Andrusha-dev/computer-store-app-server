import type {PaginationCriteria, PaginationMeta} from "../dtos/pagination/pagination.schema.ts";


export interface FindManyOptions<T, V> {
    filters: T;
    sortType: V;
    criteria: PaginationCriteria;
}

export interface FindManyResult<T> {
    content: T[];
    meta: PaginationMeta;
}