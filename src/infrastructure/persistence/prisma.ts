/*
import { PrismaClient } from '@prisma/client';
import {config} from "../../config/index.ts";




export class PrismaService extends PrismaClient {
    constructor() {
        super({
            datasources: {
                db: {
                    url: config.database.url,
                },
            }
        });
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
*/





import { PrismaClient } from '../../generated/prisma/client.ts'; // шлях до вашого згенерованого файлу

const prisma = new PrismaClient();

export default prisma;
