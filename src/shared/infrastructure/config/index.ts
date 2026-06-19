import dotenv from 'dotenv';
import {z} from "zod";

// Завантажуємо змінні оточення з .env файлу
dotenv.config();



const envSchema = z.object({
    //Гнучкі змінні (Можуть мати значення за змовчуванням)
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    MONO_API_URL: z.url().default("https://api.monobank.ua/api"),
    PORT: z.coerce.number().default(3001),

    //Критичні змінні (мають обовязково вказуватись в .env, якщо process.env.NODE_ENV === 'production')
    MONO_API_TOKEN: process.env.NODE_ENV === 'production'
        ? z.string()
        : z.string().default("mock-token"),
    MONO_PUBLIC_KEY: process.env.NODE_ENV === 'production'
        ? z.string().min(50, "Публічний ключ занадто короткий")
        : z.string().default("mock-public-key"),
    ALLOWED_ORIGIN: process.env.NODE_ENV === 'production'
        ? z.url()
        : z.url().default("http://localhost:5173"),
    ACCESS_TOKEN_SECRET: process.env.NODE_ENV === 'production'
        ? z.string().min(20)
        : z.string().min(20).default("yourAccessTokenSecret"),
    REFRESH_TOKEN_SECRET: process.env.NODE_ENV === 'production'
        ? z.string().min(20)
        : z.string().min(20).default("yourRefreshTokenSecret"),

    //Має бути обовязково прописана в .env, незалежно від значення process.env.NODE_ENV
    DATABASE_URL: z.url(),


    // ... інші змінні
});


const env = envSchema.parse(process.env); // Якщо хоч однієї змінної немає — сервер навіть не спробує запуститися

export const config = {
    nodeEnv: env.NODE_ENV,
    isProduction: env.NODE_ENV === 'production',
    allowedOrigin: {
        url: env.ALLOWED_ORIGIN,
    },
    database: {
        url: env.DATABASE_URL,
    },
    monoApi: {
        url: env.MONO_API_URL,
        token: env.MONO_API_TOKEN,
        pubKey: env.MONO_PUBLIC_KEY,
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