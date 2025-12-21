import dotenv from 'dotenv';

// Завантажуємо змінні оточення з .env файлу
dotenv.config();

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "superSecretAccessTokenFallback";
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "superSecretRefreshTokenFallback";
export const PORT = 3001;

// Додано запасні значення на випадок, якщо змінні не встановлені.
// У реальному проекті варто обробляти відсутність секретів більш строго (наприклад, викидати помилку).