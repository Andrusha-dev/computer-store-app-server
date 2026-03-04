import dotenv from 'dotenv';

// Завантажуємо змінні оточення з .env файлу
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || "production";
//Змінна оточення, яка перевіряє чи додаток запущений в режимі розробника
//Потрібно, наприклад, для відправки додаткових даних про помилку, які в продакшені бачити не варто
export const isDevelopment = NODE_ENV === "development";
export const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:5173"
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "superSecretAccessTokenFallback";
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "superSecretRefreshTokenFallback";
export const PORT = Number(process.env.PORT) || 3001;

// Додано запасні значення на випадок, якщо змінні не встановлені.
// У реальному проекті варто обробляти відсутність секретів більш строго (наприклад, викидати помилку).