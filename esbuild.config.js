// esbuild-script.js
const esbuild = require('esbuild');

// Конфігурація для збірки
const options = {
    entryPoints: ['src/server.ts'], // Вкажіть ваш головний вхідний файл
    bundle: true,
    platform: 'node', // Обов'язково для Node.js/Express
    target: ['node24'], // Або інша версія Node, яку ви використовуєте
    outdir: 'dist', // Папка для вихідних файлів
    mainFields: ['module', 'main'], // Допомагає resolve Node.js модулів
    external: ['express'], // Додайте всі пакети, які не потрібно включати в бандл (наприклад, express, які є в node_modules)
    sourcemap: true,
    logLevel: 'info',
};

// Функція для збірки
async function build() {
    try {
        // Виконуємо збірку
        await esbuild.build(options);
        console.log('✅ Збірка Express.js успішно завершена!');
    } catch (error) {
        console.error('❌ Помилка збірки esbuild:', error);
        process.exit(1);
    }
}

// Запуск
build();