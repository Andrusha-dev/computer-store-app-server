import {type User} from "../types/models/user.ts";

export const users: User[] = [
    {
        id: 1,
        email: "andrushastus@gmail.com",
        password: "gugugugagaga",
        username: "Andrusha",
        firstname: "Andrew",
        lastname: "Stus",
        address: {
            city: "Los-Angeles",
            street: "Jefferson",
            houseNumber: 18
        },
        phone: "+38(097)123-45-67",
        birthYear: 1987,
        profession: "react-developer",
        isMarried: true,
        role: "admin"
    },
    {
        id: 2,
        email: "john@gmail.com",
        password: "gugugugagaga",
        username: "Johnny",
        firstname: "John",
        lastname: "Preastley",
        address: {
            city: "New York",
            street: "Broadway",
            houseNumber: 16
        },
        phone: "+38(063)765-43-21",
        birthYear: 1985,
        profession: "react-developer",
        isMarried: true,
        role: "user"
    }
];