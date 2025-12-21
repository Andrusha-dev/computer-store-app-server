import type {Request, Response} from "express";
import express from "express"
import jwt from "jsonwebtoken";
import type {Transaction} from "./types/models/transaction.ts";
import type {User, UserRole} from "./types/models/user.ts";
import {jwtDecode} from "jwt-decode";
import {processors} from "./data/pcComponents/processors.ts";
import type {
    NumberOfCores, NumberOfThreads,
    Processor,
    ProcessorFilters,
    ProcessorProducer,
    ProcessorSocket
} from "./types/models/pcComponents/processor.types.ts";
import {z} from "zod";
import {type FetchProcessorsResponseDTO} from "./types/dto/processorDTO.types.ts";
import {FetchProcessorsParamsSchema} from "./utils/validation/processorValidation.ts";
import {type FetchProcessorsParams} from "./types/params/processorParams.types.ts";
import {fetchProcessors, paginateProcessors} from "./services/processorService.ts";
import {type QueryParams} from "./types/common/request.types.ts";
import {normalizeQueryParams} from "./utils/request/index.ts";
import {users} from "./data/users.ts";
import {transactions} from "./data/transactions.ts";
import {
    generateAccessToken,
    generateRefreshToken, validateAccessToken,
    validateRefreshToken,
} from "./services/authService.ts";
import {PORT, REFRESH_TOKEN_SECRET} from "./config/index.ts";
import { setTimeout } from 'timers/promises';



const app = express();



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


    const payload: any = validateRefreshToken(refreshToken);

    if(!payload) {
        console.error("Invalid refresh token");
        return res.status(403).json({message: "Invalid refresh token"});
    }

    const newAccessToken = generateAccessToken({...payload, iat: Date.now() / 1000, exp: Date.now() / 1000 + 60});
    const newRefreshToken = generateRefreshToken({...payload, iat: Date.now() / 1000, exp: (Date.now() / 1000) + 60 * 2});
    console.log("New access token: ", newAccessToken);

    return res.json({accessToken: newAccessToken, refreshToken: newRefreshToken});
})

app.post("/validate-token", (req: Request, res: Response) => {
    const {accessToken} = req.body;

    const payload = validateAccessToken(accessToken);
    if (payload) {
        return res.json({valid: true});
    }

    return res.json({valid: false});
})


const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!accessToken) {
        return res.status(401).json({ message: "Access token is missing" });
    }


    const payload = validateAccessToken(accessToken);
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

app.get("/processors", authenticateToken, (req: Request, res: Response) => {
    console.log("Starting fetch processors");
    const queryParams = req.query;

    //Ось приклад виведення в консоль  { 'producer[]': [ 'AMD', 'Intel' ] }
    console.log("Raw req.query.minPrice:", queryParams.minPrice); // Додано для перевірки


    const normalizedQueryParams: QueryParams = normalizeQueryParams(queryParams);

    console.log(normalizedQueryParams);

    // Валідація та парсинг
    const validation = FetchProcessorsParamsSchema.safeParse(normalizedQueryParams);


    if (!validation.success) {
        return res.status(400).json({
            message: "Invalid query parameters",
            errors: validation.error.message
        });
    }

    // Отримуємо валідний об'єкт типу ProcessorFilters
    const fetchProcessorsParams: FetchProcessorsParams = validation.data;

    const filteredProcessors: Processor[] = fetchProcessors(fetchProcessorsParams);


    console.log("filteredProcessors length: ", filteredProcessors.length);

    //Отримуємо список процессорів paginatedProcessors після пагінації filteredProcessors
    const paginatedProcessors: Processor[] = paginateProcessors(
        filteredProcessors,
        {
            pageNo: fetchProcessorsParams.pageNo,
            pageSize: fetchProcessorsParams.pageSize,
            sortType: fetchProcessorsParams.sortType,
            sortOrder: fetchProcessorsParams.sortOrder
        }
    );

    //Отримуємо максимальну ціну відфільтрованих обєктів в списку filteredProcessors
    const maxPrice: number = filteredProcessors.reduce((acc, p) => Math.max(acc, p.price), 0);

    //Отримуємо мінімальну ціну відфільтрованих обєктів в списку filteredProcessors
    const minPrice: number = filteredProcessors.reduce((acc, p) => Math.min(acc, p.price), maxPrice);

    //Отримуємо список унікальних обєктів ProcessorProducer[] серед обєктів в списку filteredProcessors
    const uniqueProducers: ProcessorProducer[] = Array.from(new Set(filteredProcessors.map((p: Processor) =>
        p.processorOptions.producer)));

    //Отримуємо список унікальних обєктів ProcessorSocket[] серед обєктів в списку filteredProcessors
    const uniqueProcessorSockets: ProcessorSocket[] = Array.from(new Set(filteredProcessors.map((p: Processor) =>
        p.processorOptions.processorSocket)));

    //Отримуємо список унікальних обєктів NumberOfCores[] серед обєктів в списку filteredProcessors
    const uniqueNumberOfCores: NumberOfCores[] = Array.from(new Set(filteredProcessors.map((p: Processor) =>
        p.processorOptions.numberOfCores)));

    //Отримуємо список унікальних обєктів NumberOfThreads[] серед обєктів в списку filteredProcessors
    const uniqueNumberOfThreads: NumberOfThreads[] = Array.from(new Set(filteredProcessors.map((p: Processor) =>
        p.processorOptions.numberOfThreads)));


    const pageNo: number = fetchProcessorsParams.pageNo ?? 0;
    const pageSize: number = fetchProcessorsParams.pageSize ?? 10;
    const totalElements: number = filteredProcessors.length;
    const totalPages: number = Math.ceil(totalElements / pageSize);



    const fetchProcessorsResponseDTO: FetchProcessorsResponseDTO = {
        content: paginatedProcessors,
        minPrice: minPrice,
        maxPrice: maxPrice,
        producers: uniqueProducers,
        processorSockets: uniqueProcessorSockets,
        numberOfCores: uniqueNumberOfCores,
        numberOfThreads: uniqueNumberOfThreads,
        pageNo: pageNo,
        pageSize: pageSize,
        totalPages: totalPages,
        totalElements: totalElements,
        last: false
    }

    
    console.log("minPrice: ", fetchProcessorsResponseDTO.minPrice);
    console.log("maxPrice: ", fetchProcessorsResponseDTO.maxPrice);

    return res.json(fetchProcessorsResponseDTO);
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