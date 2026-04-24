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