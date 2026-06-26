import {config} from "./shared/infrastructure/config/index.ts";
import {initLoaders} from "./api/loaders/index.ts";
import {setupGracefulShutdown} from "./api/lifecycle/shutdown.ts";







async function bootstrap() {
        try {
                console.log("🚀 Starting bootstrap process...");

                const app = await initLoaders();

                //Тільки після успішних перевірок запускаємо Express
                const server = app.listen(config.port, () => {
                        console.log(`
                                ################################################
                                🛡️  Server listening on port: ${config.port} 🛡️
                                🏢  Environment: ${config.nodeEnv}
                                🚀  Health check: http://localhost:${config.port}/api/health
                                ################################################
                        `);
                });

                //Запускаємо прослуховування ручного закриття сервера з безпечним закриттям з'єднань
                setupGracefulShutdown(server);

        } catch (error) {
                console.error("💥 Bootstrap failed:", error);
                process.exit(1);
        }
}

// Виклик головної функції
bootstrap();