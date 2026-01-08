import type {NextFunction, Request, Response} from "express";
import {z} from "zod";
import type {QueryParams} from "../types/common/request.types.ts";
import {normalizeQueryParams} from "../utils/request/index.ts";
import type {FetchProcessorsParams} from "../types/params/processorParams.types.ts";



export const validate = (schema: z.ZodTypeAny) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const normalizedQueryParams: QueryParams = normalizeQueryParams(req.query);

            const validatedQuery = schema.parse({
                body: req.body,
                query: normalizedQueryParams,
                params: req.params,
            });

            res.locals.validatedQuery = validatedQuery;

            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Validation failed",
                    errors: error.issues,
                });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    };