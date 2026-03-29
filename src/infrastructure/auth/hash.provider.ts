import bcrypt from 'bcrypt';



const SALT_ROUNDS = 10;

export const hashProvider = {
    // Додаємо async, щоб метод повертав Promise<string>
    hash: async (password: string): Promise<string> => {
        return await bcrypt.hash(password, SALT_ROUNDS);
    },

    // Додаємо async, щоб метод повертав Promise<boolean>
    compare: async (password: string, hash: string): Promise<boolean> => {
        return await bcrypt.compare(password, hash);
    }
};

export type IHashProvider = typeof hashProvider;