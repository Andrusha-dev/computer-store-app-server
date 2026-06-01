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
        req.valid = {
            body: schemas.body ? schemas.body.parse(req.body) : undefined,
            query: schemas.query ? schemas.query.parse(normalizeQueryParams(req.query)) : undefined,
            params: schemas.params ? schemas.params.parse(req.params) : undefined,
        };

        next();


        /*
        if (schemas.body) {
            req.body = schemas.body.parse(req.body) as any;
        }

        if (schemas.query) {
            console.log("query: ", req.query);
            // Тут логіка нормалізації
            const normalized = normalizeQueryParams(req.query);
            console.log("normalized: ", normalized);
            const validatedQuery = schemas.query.parse(normalized);
            console.log("query (updated): ", validatedQuery);
            req.query = Object.assign(Object.create(null), validatedQuery);

        }

        if (schemas.params) {
            req.params = schemas.params.parse(req.params) as any;
            console.log("req.params: ", req.params);
        }

        next();
        */




        /*
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
        */
    };