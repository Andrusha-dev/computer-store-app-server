import { type AppRequestContext } from '../types/common/context.types.ts';



// Це розширення типів Express для використання нашого AppRequestContext у res.locals
declare global {
    namespace Express {
        interface Locals extends AppRequestContext {}
    }
}

// Робимо файл модулем, щоб declare global працював коректно
export {};