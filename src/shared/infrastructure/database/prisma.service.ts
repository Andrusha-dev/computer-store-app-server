//import { PrismaClient } from '@prisma/client';
import type {IDatabaseService} from "../../contracts/database.contract.ts";
import {Pool} from "pg";
import {PrismaPg} from "@prisma/adapter-pg";
import {PrismaClient} from "../../../../prisma/generated/client.ts";






export class PrismaService extends PrismaClient implements IDatabaseService {
    constructor() {
        // Створюємо пул підключень нативного драйвера pg
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL
        });

        // Створюємо адаптер для Prisma 7
        const adapter = new PrismaPg(pool);

        // Передаємо адаптер у базовий клас PrismaClient
        super({ adapter });
    }

    async connect(): Promise<void> {
        try {
            await this.$connect();
            console.log('🐘 Database connected successfully');
        } catch (error) {
            console.error('❌ Database connection failed:', error);
            process.exit(1); // Якщо бази немає — сервер не має працювати
        }
    }

    async disconnect(): Promise<void> {
        await this.$disconnect();
    }
}