export interface Address {
    city: string;
    street: string;
    houseNumber: number
}

export type UserRole = "guest" | "user" | "admin";

export interface User {
    id: number;
    email: string;
    password: string;
    username: string;
    firstname: string;
    lastname: string;
    address: Address;
    phone: string;
    birthYear: number;
    profession: string;
    isMarried: boolean;
    role: UserRole;
}


export type LoginFormValues = Pick<User, "email" | "password">; //Тип, який використовується клієнтом під час автентифікації користувача

export type UserWithoutPassword = Omit<User, "password">; //Тип, який використовує сервер після реєстрації нового користувача і може повертати клієнту