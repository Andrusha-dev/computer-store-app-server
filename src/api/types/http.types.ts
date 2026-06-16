import type {TokenPayload} from "../../shared/schemas/token-payload.schema.ts";




//Універсальний тип для параметрів запиту req.query
export interface QueryParams {
    [key: string]: string | string[] | undefined;
}

//Інтерфейс для розширення інтерфейсу Request
export interface AppRequest {
    //Поле для payload jwt токена
    tokenPayload?: TokenPayload;
    //Поле для звалідованих вхідних даних
    valid?: {
        body?: unknown;
        query?: unknown;
        params?: unknown;
    };
    //Поле для сирого тіла запиту (до парсинга express)
    rawBody?: Buffer
}