import type {Request, Response} from "express";
import express from "express"
import jwt from "jsonwebtoken";
import type {Transaction} from "./types/transaction";
import type {User, UserRole} from "./types/user";
import {jwtDecode} from "jwt-decode";

const app = express();
const PORT = 3001;

// Секретный ключ для подписи токенов
const ACCESS_TOKEN_SECRET = "yourAccessTokenSecret"; // Никогда не используйте такую строчку в реальных проектах, храните секреты в .env.
const REFRESH_TOKEN_SECRET = "yourRefreshTokenSecret";

function generateAccessToken(payload: any) {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET); // Токен действует 1 час
}

function generateRefreshToken(payload: any) {
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET);
    return refreshToken;
}

// Пример валидации JWT
function validateToken(token: string) {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (error) {
        return null; // Если токен неверен или истек
    }
}


const users: User[] = [
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

const transactions: Transaction[] = [
    {
        id: 1,
        userId: 1,
        type: "income",
        category: "Devidends",
        amount: 32000,
        date: "2025-09-06T09:32:29.529Z",
        note: "Отримання щомісячних девідендів"
    },
    {
        id: 2,
        userId: 2,
        type: "expense",
        category: "Products",
        amount: 2800,
        date: "2025-09-07T12:48:29.529Z",
        note: "Купівля харчових продуктів"
    },
    {
        id: 3,
        userId: 1,
        type: "expense",
        category: "Products",
        amount: 2500,
        date: "2025-09-07T18:24:29.529Z",
        note: "Купівля продуктів"
    },
    {
        id: 4,
        userId: 1,
        type: "income",
        category: "Cellary",
        amount: 124000,
        date: "2025-09-08T12:18:29.529Z",
        note: "Зарплата"
    },
];

const getLatestUserId = (): number => {
    let latestId: number = 0;
    users.forEach((user) => {
        if(user.id > latestId) latestId = user.id;
    });
    return latestId;
}

const getLatestTransactionId = (): number => {
    let latestId: number = 0;
    transactions.forEach((ta) => {
        if (ta.id > latestId) latestId = ta.id;
    });
    return latestId;
}

app.use(express.json());

app.use((req: Request, res: Response, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});



app.post("/users", (req: Request, res: Response) => {
    const {email, password, username, firstname, lastname, address, phone, birthYear, profession, isMarried} = req.body;

    const newUser: User = {
        id: getLatestUserId() + 1,
        email: email,
        password: password,
        username: username,
        firstname: firstname,
        lastname: lastname,
        address: address,
        phone: phone,
        birthYear: birthYear,
        profession: profession,
        isMarried: isMarried,
        role: "user"
    }

    users.push(newUser);

    const resUser: Omit<User, "password"> = {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        address: newUser.address,
        phone: newUser.phone,
        birthYear: newUser.birthYear,
        profession: newUser.profession,
        isMarried: newUser.isMarried,
        role: newUser.role
    }

    console.log(resUser.id, resUser.email, resUser.username, resUser.firstname, resUser.lastname, resUser.address, resUser.phone, resUser.birthYear, resUser.profession, resUser.isMarried, resUser.role);

    return res.status(200).json(resUser);
})

// Пример эндпоинта для генерации токена
app.post("/login", (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user: User | undefined = users.find((user) => user.email === email && user.password === password);

    if (user) {

        const payload = { id: user.id, email: user.email, role: user.role };

        const accessToken = generateAccessToken({...payload, iat: Date.now() / 1000, exp: Date.now() / 1000 + 60});
        console.log("Starting access token: ", accessToken);
        const refreshToken = generateRefreshToken({...payload, iat: Date.now() / 1000, exp: (Date.now() / 1000) + 60 * 2});

        return res.json({ accessToken, refreshToken });
    }

    res.status(401).json({ message: "Invalid username or password" });
});

app.post("/refresh-all-tokens", (req: Request, res: Response) => {
    const {refreshToken} = req.body;
    console.log("refreshToken: ", refreshToken);
    if(!refreshToken) {
        console.error("refresh token is undefined");
        return res.status(403).json({message: "refresh token is undefined"});
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (error, payload) => {
        if (error) {
            console.error("Incorrect refresh token: ", error);
            return res.status(403).json({message: "Incorrect refresh token"});
        }


        const newAccessToken = generateAccessToken({...payload, iat: Date.now() / 1000, exp: Date.now() / 1000 + 60});
        const newRefreshToken = generateRefreshToken({...payload, iat: Date.now() / 1000, exp: (Date.now() / 1000) + 60 * 2});
        console.log("New access token: ", newAccessToken);
        return res.json({accessToken: newAccessToken, refreshToken: newRefreshToken});
    });
})

app.post("/validate-token", (req: Request, res: Response) => {
    const {accessToken} = req.body;

    const payload = validateToken(accessToken);
    if (payload) {
        return res.json({valid: true});
    }

    return res.json({valid: false});
})


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: "Access token is missing" });
    }


    const payload = validateToken(token);
    console.log(payload);


    if (!payload) {
        return res.status(403).json({ message: "Invalid token" });
    }


    next();
};

app.get("/users", authenticateToken, (req: Request, res: Response) => {
    const authHeader: string | undefined = req.headers["authorization"];
    const accessToken: string | undefined = authHeader && authHeader.split(" ")[1];

    if (!accessToken) {
        return res.status(401).json({ message: "Access token is missing" });
    }

    const decode: any = jwtDecode(accessToken);
    const id: number = decode.id;
    const role: UserRole = decode.role;
    const user: User | undefined = users.find((user) => user.id === id && user.role === "admin" && role === "admin");
    if(!user) {
        return res.status(403).json({message: `Undefined user with id ${id} or role \"admin\"`});
    }

    const resUsers: Omit<User, "password">[] = users.map((user) => {
        const resUser: Omit<User, "password"> = {
            id: user.id,
            email: user.email,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            address: user.address,
            phone: user.phone,
            birthYear: user.birthYear,
            profession: user.profession,
            isMarried: user.isMarried,
            role: user.role
        }

        return resUser;
    });

    return res.status(200).json(resUsers)
})

app.get("/users/me", authenticateToken, (req: Request, res: Response) => {
    const authHeader: string | undefined = req.headers["authorization"];
    const accessToken: string | undefined = authHeader && authHeader.split(" ")[1];

    if (!accessToken) {
        return res.status(401).json({ message: "Access token is missing" });
    }

    const decode: any = jwtDecode(accessToken);
    const id: number = decode.id;
    const user: User | undefined = users.find((user) => user.id === id);
    if(!user) {
        return res.status(401).json({message: `Undefined user with id ${id}`});
    }

    const resUser: Omit<User, "password"> = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        address: user.address,
        phone: user.phone,
        birthYear: user.birthYear,
        profession: user.profession,
        isMarried: user.isMarried,
        role: user.role
    }

    return res.json(resUser);
})

app.get("/transactions/me", authenticateToken, (req: Request, res: Response) => {
    const authHeader: string | undefined = req.headers["authorization"];
    const accessToken: string | undefined = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if (accessToken) {
        const decode: any = jwtDecode(accessToken);
        const userId: number = decode.id;
        const userTransactions: Transaction[] = transactions.filter((ta) => ta.userId === userId);
        return res.json(userTransactions);
    }
});

app.get("/transactions/me/:id", authenticateToken, (req: Request, res: Response) => {
    const {id} = req.params;
    const authHeader: string | undefined = req.headers["authorization"];
    const accessToken: string | undefined = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if (accessToken) {
        const decode: any = jwtDecode(accessToken);
        const userId: number = decode.id;
        const userTransactions: Transaction[] = transactions.filter((ta) => ta.userId === userId);
        const transaction: Transaction | undefined = userTransactions.find((ta) => ta.id === parseInt(id));
        if(transaction) {
            return res.json(transaction);
        }
    }

    return res.status(404).json({message: "Transaction with id ${id} not found"});
})

app.post("/transactions", authenticateToken, (req: Request, res: Response) => {
    const transaction: Omit<Transaction, "id"> = req.body;

    const authHeader: string | undefined = req.headers["authorization"];
    const accessToken: string | undefined = authHeader && authHeader.split(" ")[1];

    if (!accessToken) {
        return res.status(401).json({ message: "Access token is missing" });
    }

    const decode: any = jwtDecode(accessToken);
    const id: number = decode.id;
    const financialAccount: FinancialAccount | undefined = financialAccounts.find((ac) => ac.id === id);
    if (!financialAccount) {
        return res.status(404).json({message: `Account with id ${id} not found`});
    }
    if (transaction.type === "expense" && financialAccount && transaction.amount > financialAccount.balance) {
        return res.status(400).json({message: "amount for operation \"expense\" is greater than balance"});
    }

    const newTransaction: Transaction = {
        ...transaction,
        id: getLatestTransactionId() + 1,
    }

    transactions.push(newTransaction);

    if (newTransaction.type === "income") {
        financialAccount.balance += newTransaction.amount;
    } else {
        financialAccount.balance -= newTransaction.amount;
    }

    return res.json(newTransaction);
});


// Запуск сервера
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));