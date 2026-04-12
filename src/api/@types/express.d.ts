import type {AppRequestContext} from "../types/http.types.ts";


// Виносимо інтерфейс, щоб він був доступний глобально
declare global {
    namespace Express {
        // Розширюємо стандартний інтерфейс Locals
        interface Locals extends AppRequestContext {}
    }
}

export {}; // Робимо файл модулем