import {config} from "./shared/infrastructure/config/index";
import {initLoaders} from "./api/loaders/index";
import {setupGracefulShutdown} from "./api/lifecycle/shutdown";
import type {ILoggerService} from "./shared/contracts/logger.contract";
import {container} from "./shared/infrastructure/di/container";







async function bootstrap() {
        const logger = container.resolve<ILoggerService>('logger');

        try {
                logger.info("🚀 Starting bootstrap process...");

                const app = await initLoaders();

                //Тільки після успішних перевірок запускаємо Express
                const server = app.listen(config.port, () => {
                        logger.info(`
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
                logger.error("💥 Bootstrap failed:", error);
                process.exit(1);
        }
}

// Виклик головної функції
bootstrap();