import {container} from "../../shared/infrastructure/di/container.ts";
import type {IDatabaseService} from "../../shared/contracts/database.contract.ts";


export const databaseLoader = async (): Promise<void> => {
    const dbService = container.resolve<IDatabaseService>("dbService");
    await dbService.connect();
}