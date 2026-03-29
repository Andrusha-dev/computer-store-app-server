import dotenv from 'dotenv';
import {z} from "zod";

// Завантажуємо змінні оточення з .env файлу
dotenv.config();



const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    ALLOWED_ORIGIN: z.url(),
    DATABASE_URL: z.url(),
    ACCESS_TOKEN_SECRET: z.string().min(20),
    REFRESH_TOKEN_SECRET: z.string().min(20),
    PORT: z.coerce.number().default(3001),
    // ... інші змінні
});

const env = envSchema.parse(process.env); // Якщо хоч однієї змінної немає — сервер навіть не спробує запуститися

export const config = {
    nodeEnv: env.NODE_ENV,
    isDev: env.NODE_ENV === 'development',
    allowedOrigin: {
        url: env.ALLOWED_ORIGIN,
    },
    database: {
        url: env.DATABASE_URL,
    },
    jwt: {
        access: {
            secret: env.ACCESS_TOKEN_SECRET,
            expiresIn: '1m',
        },
        refresh: {
            secret: env.REFRESH_TOKEN_SECRET,
            expiresIn: '2m',
        }
    },
    port: env.PORT,
} as const; // as const робить об'єкт read-only для TypeScript




/*
export const NODE_ENV = process.env.NODE_ENV || "production";
//Змінна оточення, яка перевіряє чи додаток запущений в режимі розробника
//Потрібно, наприклад, для відправки додаткових даних про помилку, які в продакшені бачити не варто
export const isDevelopment = NODE_ENV === "development";
export const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:5173"

export const DATABASE_URL = process.env.DATABASE_URL

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "superSecretAccessTokenFallback";
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "superSecretRefreshTokenFallback";

export const PORT = Number(process.env.PORT) || 3001;

// Додано запасні значення на випадок, якщо змінні не встановлені.
// У реальному проекті варто обробляти відсутність секретів більш строго (наприклад, викидати помилку).
 */