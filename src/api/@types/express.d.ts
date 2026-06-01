import type {AppRequest} from "../types/http.types.ts";



declare global {
    namespace Express {
        interface Request extends AppRequest {}
    }
}

export {};


/*
// Виносимо інтерфейс, щоб він був доступний глобально
declare global {
    namespace Express {
        // Розширюємо стандартний інтерфейс Locals
        interface Locals extends AppRequestContext {}
    }
}

export {}; // Робимо файл модулем
*/