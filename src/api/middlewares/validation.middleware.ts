import type {NextFunction, Request, Response} from "express";
import {normalizeQueryParams} from "../helpers/http.helpers.ts";
import {z} from "zod";



//Тип який містить схеми валідації для вхідних даних. Є аргументом для validation.middleware.ts
export interface RequestSchemas {
    body?: z.ZodTypeAny;
    query?: z.ZodTypeAny;
    params?: z.ZodTypeAny;
}


export const validate = (schemas: RequestSchemas) =>
    (req: Request, res: Response, next: NextFunction) => {
        if (schemas.body) {
            res.locals.validatedBody = schemas.body.parse(req.body);
        }

        if (schemas.query) {
            // Тут логіка нормалізації
            const normalized = normalizeQueryParams(req.query);
            res.locals.validatedQuery = schemas.query.parse(normalized);
        }

        if (schemas.params) {
            res.locals.validatedParams = schemas.params.parse(req.params);
        }

        next();
    };