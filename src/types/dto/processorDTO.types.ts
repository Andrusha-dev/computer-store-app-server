import type {Processor} from "../entity/pcComponents/processor.types.ts";

export interface FetchProcessorsRequestDTO {

}

export interface FetchProcessorsResponseDTO {
    content: Processor[];
    pageNo: number;          // Відповідає PageParams.page
    pageSize: number;          // Відповідає PageParams.size
    totalElements: number; // Необхідно для розрахунку кількості сторінок на фронтенді
    totalPages: number;    // Зазвичай бекенд одразу це рахує
    last?: boolean;
}