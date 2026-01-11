import type {NextFunction, Request, Response} from "express";
import {z} from "zod";
import type {QueryParams} from "../types/common/request.types.ts";
import {normalizeQueryParams} from "../utils/request/index.ts";


//middleware для валідації даних запиту: body, query та params та передачі звалідованих даних через res.locals
export const validate = (schema: z.ZodTypeAny) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const normalizedQueryParams: QueryParams = normalizeQueryParams(req.query);

            const validatedRequest = schema.parse({
                body: req.body,
                query: normalizedQueryParams,
                params: req.params,
            });

            res.locals.validatedRequest = validatedRequest;

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