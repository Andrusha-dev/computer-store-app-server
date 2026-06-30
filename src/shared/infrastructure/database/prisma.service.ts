import type {IDatabaseService} from "../../contracts/database.contract";
import {Pool} from "pg";
import {PrismaPg} from "@prisma/adapter-pg";
import {PrismaClient} from "../../../../prisma/generated/client";
import type {ILoggerService} from "../../contracts/logger.contract";




interface Dependencies {
    logger: ILoggerService;
}

export class PrismaService extends PrismaClient implements IDatabaseService {
    private readonly logger: ILoggerService;

    constructor({logger}: Dependencies) {
        // Створюємо пул підключень нативного драйвера pg
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL
        });

        // Створюємо адаптер для Prisma 7
        const adapter = new PrismaPg(pool);

        // Передаємо адаптер у базовий клас PrismaClient
        super({ adapter });

        this.logger = logger;
    }

    async connect(): Promise<void> {
        try {
            //Цей метод перевіряє чи працює рушій Prisma
            await this.$connect();
            //Цей метод перевіряє фактичне підключення до бази даних через легкий sql запит
            await this.$queryRaw`SELECT 1;`;
            this.logger.info("[PRISMA_SERVICE]: Database connected successfully");
            //console.log('🐘 Database connected successfully');
        } catch (error) {
            this.logger.error("[PRISMA_SERVICE]: Database connection failed", error, {service: "PrismaService"})
            //console.error('❌ Database connection failed:', error);
            process.exit(1); // Якщо бази немає — сервер не має працювати
        }
    }

    async disconnect(): Promise<void> {
        await this.$disconnect();
    }
}