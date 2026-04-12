import {z} from "zod";



//Тип який містить схеми валідації для вхідних даних. Є аргументом для validation.middleware.ts
export interface RequestSchemas {
    body?: z.ZodTypeAny;
    query?: z.ZodTypeAny;
    params?: z.ZodTypeAny;
}