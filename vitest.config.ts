import { defineConfig } from 'vitest/config';


export default defineConfig({
    test: {
        globals: true, //Дозволяє використовувати describe, test, expect без імпорту в кожному файлі
        environment: 'node', //Тестуємо бекенд-додаток
    },
});