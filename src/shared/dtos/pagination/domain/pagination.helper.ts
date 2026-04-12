import type {PaginationResult} from "./pagination.contract.ts";

export const createPaginationResult =
    (pageNo: number, pageSize: number, totalElements: number): PaginationResult => {
        const totalPages: number = Math.ceil(totalElements / pageSize) || 1;
        const last: boolean = pageNo >= totalPages - 1;

        const paginationResult: PaginationResult = {
            pageNo,
            pageSize,
            totalElements,
            totalPages,
            last
        }

        return paginationResult;
    }