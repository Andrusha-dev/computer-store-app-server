import type {NextFunction, Request, Response} from "express";
import express from "express"
import jwt from "jsonwebtoken";
import type {Transaction} from "./types/models/transaction.ts";
import type {User, UserRole, UserWithoutPassword} from "./types/models/user.ts";
import {jwtDecode} from "jwt-decode";
import {processors} from "./data/pcComponents/processors.ts";
import type {
    NumberOfCores, NumberOfThreads,
    Processor,
    ProcessorProducer,
    ProcessorSocket
} from "./types/models/pcComponents/processor.types.ts";
import {z} from "zod";
import {type GetProcessorsCatalogResponse} from "./types/dto/processorDTO.types.ts";
import {
    type FetchProcessorsParams,
    fetchProcessorsParamsSchema,
    type ProcessorFilters
} from "./types/params/processorParams.types.ts";
import {fetchProcessors, getProcessorsCatalog, paginateProcessors} from "./services/processorService.ts";
import {type QueryParams} from "./types/common/request.types.ts";
import {normalizeQueryParams} from "./utils/request/index.ts";
import {users} from "./data/users.ts";
import {transactions} from "./data/transactions.ts";
import {
    generateAccessToken,
    generateRefreshToken, login, validateAccessToken,
    validateRefreshToken,
} from "./services/authService.ts";
import {PORT, REFRESH_TOKEN_SECRET} from "./config/index.ts";
import { setTimeout } from 'timers/promises';
import {
    type LoginRequest,
    loginRequestSchema, type LoginResponse,
    type TokenPayload
} from "./types/dto/authDTO.types.ts";
import {authenticateToken, authorizeRole} from "./middleware/auth.middleware.ts";
import {validate} from "./middleware/validation.middleware.ts";
import type {PageParams} from "./types/params/pageParams.types.ts";
import {fetchAuthUser, getUsersList} from "./services/userService.ts";
import type {FetchAuthUserResponse, GetUsersListResponse} from "./types/dto/userDTO.types.ts";
import {type FetchUsersParams, fetchUsersParamsSchema} from "./types/params/userParams.types.ts";



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
app.post("/login", validate(z.object({body: loginRequestSchema})), (req: Request, res: Response) => {
    //після валідації даних req.body за допомогою validate(z.object({body: LoginRequestDTOSchema})) можна
    //сміливо стверджувати, що вони відповідають типу LoginRequestDTO
    const loginRequest: LoginRequest = req.body;
    const loginResponse: LoginResponse | null = login(loginRequest);
    if(!loginResponse) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    return res.json(loginResponse);
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

app.get("/users", authenticateToken, authorizeRole(["admin"]), validate(z.object({query: fetchUsersParamsSchema})), (req: Request, res: Response) => {
    //Після валідації за допомогою middleware validate() звалідовані параметри запиту FetchUsersParams передаються в res.locals
    const fetchUsersParams: FetchUsersParams = res.locals.validation.query as FetchUsersParams;

    const getUsersListResponse: GetUsersListResponse = getUsersList(fetchUsersParams);

    return res.json(getUsersListResponse);
})

app.get("/users/me", authenticateToken, (req: Request, res: Response) => {
    //після успішної автентифікації через middleware authenticateToken payload вхідного jwt-токена передається в res.locals.payload
    const {id} = res.locals.payload as TokenPayload;

    const fetchAuthUserResponse: FetchAuthUserResponse | null = fetchAuthUser(id);
    if(!fetchAuthUserResponse) {
        return res.status(401).json({message: `Undefined user with id ${id}`});
    }

    return res.json(fetchAuthUserResponse);
})

app.get("/processors", authenticateToken, validate(z.object({query: fetchProcessorsParamsSchema})), (req: Request, res: Response) => {
    console.log("Starting fetch processors");
    //після валідації даних req.query за допомогою validate(z.object({query: fetchProcessorsParamsSchema})) вони
    // точно відповідають типу FetchProcessorsParams і були передані в res.locals.validatedQuery.query
    const fetchProcessorsParams: FetchProcessorsParams = res.locals.validatedQuery.query;

    const getProcessorsCatalogResponse: GetProcessorsCatalogResponse = getProcessorsCatalog(fetchProcessorsParams);
    
    console.log("minPrice: ", getProcessorsCatalogResponse.minPrice);
    console.log("maxPrice: ", getProcessorsCatalogResponse.maxPrice);

    return res.json(getProcessorsCatalogResponse);
});

/*
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
*/


/*Для express js версії 4 потрібно встановити залежність express-async-errors, для автоматичної обробки асинхронних помилок.
В express js версії 5 обробник вже працює з коробки*/
//Глобальний обробник для необроблених помилок
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // Якщо це помилка валідації нашої відповіді
    if (err instanceof z.ZodError) {
        console.error("RESPONSE VALIDATION ERROR:", err.issues);
        return res.status(500).json({
            message: "Server produced invalid response data",
            details: err.issues
        });
    }

    // Будь-яка інша непередбачувана помилка
    res.status(500).json({ message: "Something went wrong on the server" });
});


// Запуск сервера
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));