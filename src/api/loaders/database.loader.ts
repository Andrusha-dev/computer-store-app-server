import {container} from "../../shared/infrastructure/di/container";
import type {IDatabaseService} from "../../shared/contracts/database.contract";


export const databaseLoader = async (): Promise<void> => {
    const dbService = container.resolve<IDatabaseService>("dbService");
    await dbService.connect();
}