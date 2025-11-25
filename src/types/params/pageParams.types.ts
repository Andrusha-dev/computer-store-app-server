export type SortType = "price" | "quantity";
export type SortOrder = "asc" | "desc";


//Тип параметрів для запитів з використанням пагінації та сортування
export interface PageParams {
    pageNo?: number;
    pageSize?: number;
    sortType?: SortType;
    SortOrder?: SortOrder;
}