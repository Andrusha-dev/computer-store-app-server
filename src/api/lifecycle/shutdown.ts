import {container} from "../../shared/infrastructure/di/container";
import type {IDatabaseService} from "../../shared/contracts/database.contract";
import type {Server} from "node:http";
import type {ILoggerService} from "../../shared/contracts/logger.contract";
import {promisify} from "node:util";



//Функція для безпечного закриття програми
export const setupGracefulShutdown = (server: Server) => {
    const handleShutdown = async () => {
        //За допомогою promisify перетворюємо callback-функцію на проміс для зручного виклику через await
        const closeHttpServer = promisify(server.close.bind(server));
        const logger = container.resolve<ILoggerService>('logger');
        const dbService = container.resolve<IDatabaseService>('dbService');

        logger.info('[SHUTDOWN]: Starting graceful shutdown...');

        //Таймер-запобіжник на самому початку (працює паралельно в Event Loop)
        const forceExitTimeout = setTimeout(() => {
            logger.error('[SHUTDOWN]: Forced exit after 10s. Heavy connections hung.');
            process.exit(1);
        }, 10000);

        try {
            logger.info('[SHUTDOWN]: Closing HTTP server (waiting for active requests)...');

            //Лагідно закриваєм http зєднання (лаконічний await завдяки promisify)
            await closeHttpServer();
            logger.info('  - HTTP server closed successfully.');

            // Чисто відключаємо базу даних
            logger.info('[SHUTDOWN]: Disconnecting Database...');

            await dbService.disconnect();
            logger.info('  - Database disconnected cleanly.');

            // Якщо закриття зєднань не зайняло більше визначеного таймером часу - то таймер скасовуємо
            clearTimeout(forceExitTimeout);

            logger.info('[SHUTDOWN]: Graceful shutdown completed successfully.\n');
            process.exit(0);
        } catch (error) {
            logger.error('[SHUTDOWN]: Error during graceful shutdown:', error);
            process.exit(1);
        }
    };

    process.on('SIGINT', handleShutdown);
    process.on('SIGTERM', handleShutdown);
};




/*
//Функція, яка реєструє слухачів подій, при ручному закритті програми
export const setupGracefulShutdown = (server: Server) => {
    //Функція, що закриває всі необхідні зєднання
    const handleShutdown = () => {
        const logger = container.resolve<ILoggerService>('logger');

        server.close(async () => {
            try {
                logger.info(`\n Handle closing start...`);

                // Витягуємо сервіс з контейнера тільки в момент вимкнення
                const dbService = container.resolve<IDatabaseService>('dbService');
                await dbService.disconnect();
                logger.info('  - Database disconnected');

                logger.info(`\n Handle closing was finished success...`);
                process.exit(0);
            } catch (error) {
                logger.error('Shutdown error:', error);
                process.exit(1);
            }
        });

        // Якщо за 10 секунд не закрилось — виходимо примусово
        setTimeout(() => process.exit(1), 10000);
    };

    //Реєстрація слухачів подій
    process.on('SIGINT', () => handleShutdown());
    process.on('SIGTERM', () => handleShutdown());
};
*/