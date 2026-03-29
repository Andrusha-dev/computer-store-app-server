import type {AppRequestContext} from "../shared/http/express.types.ts";


// Виносимо інтерфейс, щоб він був доступний глобально
declare global {
    namespace Express {
        // Розширюємо стандартний інтерфейс Locals
        interface Locals extends AppRequestContext {}
    }
}

export {}; // Робимо файл модулем