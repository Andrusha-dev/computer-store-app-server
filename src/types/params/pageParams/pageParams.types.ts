import {z} from "zod";
import {type PCComponentSortType, pcComponentSortTypeSchema} from "../../models/pcComponents/pcComponent.types.ts";
import {type UserSortType, userSortTypeSchema} from "../../models/user.ts";
import {type PaginationParams, paginationParamsShema} from "./paginationParams.types.ts";
import {type SortParams, sortParamsSchema} from "./sortParams.types.ts";




export interface PageParams extends PaginationParams, SortParams{}
export const pageParamsSchema = paginationParamsShema.extend(sortParamsSchema.shape);

//Тип параметрів для запитів з використанням пагінації та сортування
export type QueryPageParams = Partial<PageParams>;
export const queryPageParamsSchema = pageParamsSchema.partial();
