import type {TokenPayload} from "../auth/auth.schema.ts";



//Універсальний тип для параметрів запиту req.query
export interface QueryParams {
    [key: string]: string | string[] | undefined;
}

//Тип для res.locals
//Поле payload було змінене на user
export interface AppRequestContext {
    tokenPayload?: TokenPayload;
    validatedBody?: unknown;
    validatedQuery?: unknown;
    validatedParams?: unknown;
}