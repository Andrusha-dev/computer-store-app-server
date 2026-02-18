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
    type GetProcessorsCatalogParams,
    getProcessorsCatalogParamsSchema,
    type ProcessorFilters
} from "./types/params/pcComponentParams/processorParams.types.ts";
import {fetchProcessors, getProcessorsCatalog, paginateProcessors} from "./services/processorService.ts";
import {type QueryParams} from "./types/common/request.types.ts";
import {
    login, refreshAllTokens
} from "./services/authService.ts";
import {PORT, REFRESH_TOKEN_SECRET} from "./config/index.ts";
import {
    type LoginRequest,
    loginRequestSchema, type LoginResponse, loginResponseSchema,
    type RefreshAllTokensRequest, refreshAllTokensRequestSchema,
    type RefreshAllTokensResponse, refreshAllTokensResponseSchema,
    type TokenPayload
} from "./types/dto/authDTO.types.ts";
import {authenticateToken, authorizeRole} from "./middleware/auth.middleware.ts";
import {validate} from "./middleware/validation.middleware.ts";
import {createUser, fetchAuthUser, getUsersList} from "./services/userService.ts";
import {
    type CreateUserRequest, createUserRequestSchema,
    type CreateUserResponse, createUserResponseSchema,
    type FetchAuthUserResponse, fetchAuthUserResponseSchema,
    type GetUsersListResponse, getUsersListResponseSchema
} from "./types/dto/userDTO.types.ts";
import {
    type GetUsersListQueryParams,
    getUsersListQueryParamsSchema
} from "./types/params/userParams/userParams.types.ts";
import type {} from "./types/models/custom/user.model.ts";
import {Prisma} from "@prisma/client";
import prisma from "./lib/prisma.ts";
import {errorHandler} from "./middleware/error.middleware.ts";
import type {UserWithRelations} from "./types/models/generated";
import {toCreateUserResponse, toFetchAuthUserResponse, toGetUsersListResponse} from "./mappers/response/user.mapper.ts";
import type {CreateUserResult, FetchAuthUserResult, GetUsersListResult} from "./types/services/results/user.results.ts";
import {toLoginResponse, toRefreshAllTokensResponse} from "./mappers/response/auth.mapper.ts";
import type {LoginResult, RefreshAllTokensResult} from "./types/services/results/auth.results.ts";
import type {CreateUserArgs, FetchAuthUserArgs, GetUsersListArgs} from "./types/services/args/user.args.ts";
import {toCreateUserArgs, toFetchAuthUserArgs, toGetUsersListArgs} from "./mappers/request/user.mapper.ts";
import {toLoginArgs, toRefreshAllTokensArgs} from "./mappers/request/auth.mapper.ts";
import type {LoginArgs, RefreshAllTokensArgs} from "./types/services/args/auth.args.ts";
import {cors} from "./middleware/cors.middleware.ts";
import {validateAccessToken} from "./utils/auth.utils.ts";



const app = express();

app.use(express.json());

app.use(cors);



app.post("/api/users", validate(z.object({body: createUserRequestSchema})), async (req: Request, res: Response) => {
    const request: CreateUserRequest = req.body;
    const args: CreateUserArgs = toCreateUserArgs(request);
    const result: CreateUserResult = await createUser(args);
    const response: CreateUserResponse = toCreateUserResponse(result);
    const validatedResponse: CreateUserResponse = createUserResponseSchema.parse(response);

    return res.json(validatedResponse);
});

// Пример эндпоинта для генерации токена
app.post("/api/login", validate(z.object({body: loginRequestSchema})), async (req: Request, res: Response) => {
    //після валідації даних req.body за допомогою validate(z.object({body: LoginRequestDTOSchema})) можна
    //сміливо стверджувати, що вони відповідають типу LoginRequest
    console.log("starting login");
    const request: LoginRequest = req.body;
    const args: LoginArgs = toLoginArgs(request);
    const result: LoginResult = await login(args);
    const response: LoginResponse = toLoginResponse(result);
    const validatedResponse: LoginResponse = loginResponseSchema.parse(response);

    return res.json(validatedResponse);
});

app.post("/api/refresh-all-tokens", validate(z.object({body: refreshAllTokensRequestSchema})), (req: Request, res: Response) => {
    const request: RefreshAllTokensRequest = req.body;
    const args: RefreshAllTokensArgs = toRefreshAllTokensArgs(request)
    const result: RefreshAllTokensResult = refreshAllTokens(args);
    const response: RefreshAllTokensResponse = toRefreshAllTokensResponse(result);
    const validatedResponse: RefreshAllTokensResponse = refreshAllTokensResponseSchema.parse(response);

    return res.json(validatedResponse);
})

//Цей ендпойнт поки що не використовується бо валідація токена здійснюється локально на клієнті,
//але може використовуватися при необхідності
app.post("/api/validate-token", (req: Request, res: Response) => {
    const {accessToken} = req.body;

    const payload = validateAccessToken(accessToken);
    if (payload) {
        return res.json({valid: true});
    }

    return res.json({valid: false});
})

app.get("/api/users", authenticateToken, authorizeRole(["admin"]), validate(z.object({query: getUsersListQueryParamsSchema})), async (req: Request, res: Response) => {
    //Після валідації за допомогою middleware validate() звалідовані параметри запиту FetchUsersParams передаються в res.locals
    const queryParams: GetUsersListQueryParams = res.locals.validatedRequest.query as GetUsersListQueryParams;
    const args: GetUsersListArgs = toGetUsersListArgs(queryParams);
    const result: GetUsersListResult = await getUsersList(args);
    const response: GetUsersListResponse = toGetUsersListResponse(result);
    const validatedResponse: GetUsersListResponse = getUsersListResponseSchema.parse(response)

    return res.json(validatedResponse);
})

app.get("/api/users/me", authenticateToken, async (req: Request, res: Response) => {
    //після успішної автентифікації через middleware authenticateToken payload вхідного jwt-токена передається в res.locals.payload
    const tokenPayload: TokenPayload = res.locals.payload as TokenPayload;
    const args: FetchAuthUserArgs = toFetchAuthUserArgs(tokenPayload);
    const result: FetchAuthUserResult = await fetchAuthUser(args);
    const response: FetchAuthUserResponse = toFetchAuthUserResponse(result);
    const validatedResponse: FetchAuthUserResponse = fetchAuthUserResponseSchema.parse(response);

    return res.json(validatedResponse);
})

app.get("/api/processors", authenticateToken, validate(z.object({query: getProcessorsCatalogParamsSchema})), (req: Request, res: Response) => {
    console.log("Starting fetch processors");
    //після валідації даних req.query за допомогою validate(z.object({query: fetchProcessorsParamsSchema})) вони
    // точно відповідають типу FetchProcessorsParams і були передані в res.locals.validatedQuery.query
    const getProcessorsCatalogParams: GetProcessorsCatalogParams = res.locals.validatedRequest.query as GetProcessorsCatalogParams;

    const getProcessorsCatalogResponse: GetProcessorsCatalogResponse = getProcessorsCatalog(getProcessorsCatalogParams);
    
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
app.use(errorHandler);


// Запуск сервера
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));