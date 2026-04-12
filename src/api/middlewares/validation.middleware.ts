import type {NextFunction, Request, Response} from "express";
import type {RequestSchemas} from "../types/validation.types.ts";
import {normalizeQueryParams} from "../helpers/validation.helpers.ts";





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