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