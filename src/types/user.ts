export interface User {
    id: number;
    email: string,
    password: string,
    username: string,
    age: number,
    role: "user" | "admin"
}