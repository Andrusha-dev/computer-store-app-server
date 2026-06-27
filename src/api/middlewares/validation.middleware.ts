import type {NextFunction, Request, Response} from "express";
import {normalizeQueryParams} from "../helpers/http.helpers";
import {z} from "zod";



//Тип який містить схеми валідації для вхідних даних. Є аргументом для validation.middleware.ts
export interface RequestSchemas {
    body?: z.ZodTypeAny;
    query?: z.ZodTypeAny;
    params?: z.ZodTypeAny;
}


export const validate = (schemas: RequestSchemas) =>
    (req: Request, res: Response, next: NextFunction) => {
        req.valid = {
            body: schemas.body ? schemas.body.parse(req.body) : undefined,
            query: schemas.query ? schemas.query.parse(normalizeQueryParams(req.query)) : undefined,
            params: schemas.params ? schemas.params.parse(req.params) : undefined,
        };

        next();
    };