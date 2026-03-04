import type {TokenPayload} from "../dto/authDTO.types.ts";


export interface AppRequestContext {
    payload?: TokenPayload;    // Дані з JWT (Auth middleware)
    validatedBody?: unknown;      // Очищені дані з DTO (Body middleware)
    validatedQuery?: unknown;     // Валідовані query-параметри
    validatedParams?: unknown;    // Валідовані URL-параметри (id, slug)
}


/*
export type ValidatedResponse<T = any, V = any, P = any> = Response<any, {
    validatedRequest: {
        body: T;   // Те, що ти передав першим, стане типом для body
        query: V;
        params: P;
    };
}>;

export type AuthResponse = Response<any, {
    payload: TokenPayload;
}>;

export type FullResponse<T = any, V = any, P = any> = Response<any, {
    payload: TokenPayload;
    validatedRequest: {
        body: T;
        query: V;
        params: P;
    };
}>;
*/