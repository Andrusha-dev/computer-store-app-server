export interface PaginationResponseDTO {
    pageNo: number;          // Відповідає PageParams.page
    pageSize: number;          // Відповідає PageParams.size
    totalElements: number; // Необхідно для розрахунку кількості сторінок на фронтенді
    totalPages: number;    // Зазвичай бекенд одразу це рахує
    last?: boolean;
}