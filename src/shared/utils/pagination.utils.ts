import type {PaginationMeta} from "../schemas/pagination.schema.ts";


//Функція для створення метаданих пагінації для результатів запиту.
//Використовується в репозиторіях
export const createPaginationMeta =
    (pageNo: number, pageSize: number, totalElements: number): PaginationMeta => {
        const totalPages: number = Math.ceil(totalElements / pageSize) || 1;
        const last: boolean = pageNo >= totalPages - 1;

        const paginationMeta: PaginationMeta = {
            pageNo,
            pageSize,
            totalElements,
            totalPages,
            last
        }

        return paginationMeta;
    }