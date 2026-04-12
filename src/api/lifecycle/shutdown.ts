import {container} from "../../shared/infrastructure/di/container.ts";
import type {IDatabaseService} from "../../shared/contracts/database.contract.ts";
import type {Server} from "node:http";


//Функція, яка реєструє слухачів подій, при ручному закритті програми
export const setupGracefulShutdown = (server: Server) => {
    //Функція, що закриває всі необхідні зєднання
    const handleShutdown = () => {
        server.close(async () => {
            try {
                console.log(`\n Handle closing start...`);

                // Витягуємо сервіс з контейнера тільки в момент вимкнення
                const dbService = container.resolve<IDatabaseService>('dbService');
                await dbService.disconnect();
                console.log('  - Database disconnected');

                console.log(`\n Handle closing was finished success...`);
                process.exit(0);
            } catch (error) {
                console.error('💥 Shutdown error:', error);
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