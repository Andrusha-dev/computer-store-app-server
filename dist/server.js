"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_decode_1 = require("jwt-decode");
const processors_ts_1 = require("./data/pcComponents/processors.ts");
const app = (0, express_1.default)();
const PORT = 3001;
// Секретный ключ для подписи токенов
const ACCESS_TOKEN_SECRET = "yourAccessTokenSecret"; // Никогда не используйте такую строчку в реальных проектах, храните секреты в .env.
const REFRESH_TOKEN_SECRET = "yourRefreshTokenSecret";
function generateAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, ACCESS_TOKEN_SECRET); // Токен действует 1 час
}
function generateRefreshToken(payload) {
    const refreshToken = jsonwebtoken_1.default.sign(payload, REFRESH_TOKEN_SECRET);
    return refreshToken;
}
// Пример валидации JWT
function validateToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
    }
    catch (error) {
        return null; // Если токен неверен или истек
    }
}
const users = [
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
const transactions = [
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
const getLatestUserId = () => {
    let latestId = 0;
    users.forEach((user) => {
        if (user.id > latestId)
            latestId = user.id;
    });
    return latestId;
};
const getLatestTransactionId = () => {
    let latestId = 0;
    transactions.forEach((ta) => {
        if (ta.id > latestId)
            latestId = ta.id;
    });
    return latestId;
};
app.use(express_1.default.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.post("/users", (req, res) => {
    const { email, password, username, firstname, lastname, address, phone, birthYear, profession, isMarried } = req.body;
    const newUser = {
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
    };
    users.push(newUser);
    const resUser = {
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
    };
    console.log(resUser.id, resUser.email, resUser.username, resUser.firstname, resUser.lastname, resUser.address, resUser.phone, resUser.birthYear, resUser.profession, resUser.isMarried, resUser.role);
    return res.status(200).json(resUser);
});
// Пример эндпоинта для генерации токена
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const user = users.find((user) => user.email === email && user.password === password);
    if (user) {
        const payload = { id: user.id, email: user.email, role: user.role };
        const accessToken = generateAccessToken(Object.assign(Object.assign({}, payload), { iat: Date.now() / 1000, exp: Date.now() / 1000 + 60 }));
        console.log("Starting access token: ", accessToken);
        const refreshToken = generateRefreshToken(Object.assign(Object.assign({}, payload), { iat: Date.now() / 1000, exp: (Date.now() / 1000) + 60 * 2 }));
        return res.json({ accessToken, refreshToken });
    }
    res.status(401).json({ message: "Invalid username or password" });
});
app.post("/refresh-all-tokens", (req, res) => {
    const { refreshToken } = req.body;
    console.log("refreshToken: ", refreshToken);
    if (!refreshToken) {
        console.error("refresh token is undefined");
        return res.status(403).json({ message: "refresh token is undefined" });
    }
    jsonwebtoken_1.default.verify(refreshToken, REFRESH_TOKEN_SECRET, (error, payload) => {
        if (error) {
            console.error("Incorrect refresh token: ", error);
            return res.status(403).json({ message: "Incorrect refresh token" });
        }
        const newAccessToken = generateAccessToken(Object.assign(Object.assign({}, payload), { iat: Date.now() / 1000, exp: Date.now() / 1000 + 60 }));
        const newRefreshToken = generateRefreshToken(Object.assign(Object.assign({}, payload), { iat: Date.now() / 1000, exp: (Date.now() / 1000) + 60 * 2 }));
        console.log("New access token: ", newAccessToken);
        return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    });
});
app.post("/validate-token", (req, res) => {
    const { accessToken } = req.body;
    const payload = validateToken(accessToken);
    if (payload) {
        return res.json({ valid: true });
    }
    return res.json({ valid: false });
});
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
app.get("/users", authenticateToken, (req, res) => {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];
    if (!accessToken) {
        return res.status(401).json({ message: "Access token is missing" });
    }
    const decode = (0, jwt_decode_1.jwtDecode)(accessToken);
    const id = decode.id;
    const role = decode.role;
    const user = users.find((user) => user.id === id && user.role === "admin" && role === "admin");
    if (!user) {
        return res.status(403).json({ message: `Undefined user with id ${id} or role \"admin\"` });
    }
    const resUsers = users.map((user) => {
        const resUser = {
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
        };
        return resUser;
    });
    return res.status(200).json(resUsers);
});
app.get("/users/me", authenticateToken, (req, res) => {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];
    if (!accessToken) {
        return res.status(401).json({ message: "Access token is missing" });
    }
    const decode = (0, jwt_decode_1.jwtDecode)(accessToken);
    const id = decode.id;
    const user = users.find((user) => user.id === id);
    if (!user) {
        return res.status(401).json({ message: `Undefined user with id ${id}` });
    }
    const resUser = {
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
    };
    return res.json(resUser);
});
app.get("/processors", authenticateToken, (req, res) => {
    console.log("fetching processors start");
    /*
    const authHeader: string | undefined = req.headers["authorization"];
    const accessToken: string | undefined = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if (accessToken) {
        const decode: any = jwtDecode(accessToken);
        const userId: number = decode.id;
        const userTransactions: Transaction[] = transactions.filter((ta) => ta.userId === userId);
        return res.json(userTransactions);
    }
     */
    return res.json(processors_ts_1.processors);
});
app.get("/transactions/me/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if (accessToken) {
        const decode = (0, jwt_decode_1.jwtDecode)(accessToken);
        const userId = decode.id;
        const userTransactions = transactions.filter((ta) => ta.userId === userId);
        const transaction = userTransactions.find((ta) => ta.id === parseInt(id));
        if (transaction) {
            return res.json(transaction);
        }
    }
    return res.status(404).json({ message: "Transaction with id ${id} not found" });
});
/*
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
*/
// Запуск сервера
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
//# sourceMappingURL=server.js.map