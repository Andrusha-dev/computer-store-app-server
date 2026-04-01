import bcrypt from 'bcrypt';
import type {IHashProvider} from "./hash.contract.ts";




export class BcryptProvider implements IHashProvider {
    private readonly saltRounds = 10;

    // Додаємо async, щоб метод повертав Promise<string>
    hash = async (data: string): Promise<string> => {
        return await bcrypt.hash(data, this.saltRounds);
    }

    // Додаємо async, щоб метод повертав Promise<boolean>
    compare = async (data: string, hash: string): Promise<boolean> => {
        return await bcrypt.compare(data, hash);
    }
}

