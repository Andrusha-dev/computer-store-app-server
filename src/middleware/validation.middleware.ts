import type {NextFunction, Request, Response} from "express";
import {z} from "zod";
import {normalizeQueryParams} from "../utils/request/normalize.utils.ts";


//Тип який містить схеми валідації для вхідних даних
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
            // Тут ваша логіка нормалізації
            const normalized = normalizeQueryParams(req.query);
            res.locals.validatedQuery = schemas.query.parse(normalized);
        }

        if (schemas.params) {
            res.locals.validatedParams = schemas.params.parse(req.params);
        }

        next();
    };



/*
//middleware для валідації даних запиту: body, query та params та передачі звалідованих даних через res.locals
export const validate = (schema: z.ZodTypeAny) =>
    (req: Request, res: Response, next: NextFunction) => {

        const normalizedQueryParams: QueryParams = normalizeQueryParams(req.query);

        const validatedRequest = schema.parse({
            body: req.body,
            query: normalizedQueryParams,
            params: req.params,
        });

        res.locals.validatedRequest = validatedRequest;

        next();
    };
*/