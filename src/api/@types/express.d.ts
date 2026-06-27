import type {AppRequest} from "../types/http.types";



// Розширюємо інтерфейс Request кастомним інтерфейсом AppRequest, щоб він був доступний глобально
declare global {
    namespace Express {
        interface Request extends AppRequest {}
    }
}

export {};// Робимо файл модулем