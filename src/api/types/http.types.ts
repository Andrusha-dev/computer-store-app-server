import type {TokenPayload} from "../../shared/schemas/token-payload.schema.ts";




//Універсальний тип для параметрів запиту req.query
export interface QueryParams {
    [key: string]: string | string[] | undefined;
}

//Інтерфейс для розширення інтерфейсу Request
export interface AppRequest {
    tokenPayload?: TokenPayload;
    valid?: {
        body?: unknown;
        query?: unknown;
        params?: unknown;
    }
}