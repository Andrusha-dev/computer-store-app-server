import {z} from "zod";

export interface PaginationResponseDTO {
    pageNo: number;          // Відповідає PageParams.page
    pageSize: number;          // Відповідає PageParams.size
    totalElements: number; // Необхідно для розрахунку кількості сторінок на фронтенді
    totalPages: number;    // Зазвичай бекенд одразу це рахує
    last?: boolean;
}

export const paginationResponseDTOSchema = z.object({
    pageNo: z.number().nonnegative(),
    pageSize: z.number().positive(),
    totalElements: z.number().nonnegative(),
    totalPages: z.number().nonnegative(),
    last: z.boolean().optional(),
});