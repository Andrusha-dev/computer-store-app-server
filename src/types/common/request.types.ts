//Тип даних для параметрів запиту req.query
import {z} from "zod";

export interface QueryParams {
    [key: string]: string | string[] | undefined;
}

//Тип для валідації даних у middleware
export interface RequestSchemas {
    body?: z.ZodTypeAny;
    query?: z.ZodTypeAny;
    params?: z.ZodTypeAny;
}