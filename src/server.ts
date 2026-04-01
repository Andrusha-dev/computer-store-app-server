import type {NextFunction, Request, Response, Router} from "express";
import express from "express"
import {cors} from "./shared/cors/cors.middleware.ts";
import {validate} from "./shared/validation/validation.middleware.ts";
import {
        type CreateUserDto,
        createUserDtoSchema,
        type GetUsersListQuery,
        getUsersListQuerySchema
} from "./modules/user/api/user.dto.ts";
import {
        extractTokenPayloadOrThrow,
        extractValidatedBodyOrThrow,
        extractValidatedQueryOrThrow
} from "./shared/http/express.helpers.ts";
import {
        toCreateUserPayload,
        toCreateUserResponse,
        toFetchAuthUserResponse,
        toGetUsersListOptions, toGetUsersListResponse
} from "./modules/user/api/user.mapper.ts";
import {UserService} from "./modules/user/domain/user.service.ts";
import {
        type LoginDto,
        loginDtoSchema,
        type RefreshAllTokensDto,
        refreshAllTokensDtoSchema
} from "./modules/auth/api/auth.dto.ts";
import {
        toLoginPayload,
        toLoginResponse,
        toRefreshAllTokensPayload,
        toRefreshAllTokensResponse
} from "./modules/auth/api/auth.mapper.ts";
//import {authenticateToken, authorizeRole} from "./shared/auth/auth.middleware.ts";
import {
        type GetProcessorsCatalogParams,
        getProcessorsCatalogParamsSchema
} from "./types/params/pcComponentParams/processorParams.types.ts";
import {getProcessorsCatalog} from "./modules/pcComponent/domain/processor.service.ts";
import {errorHandler} from "./shared/error/error.middleware.ts";
import {config} from "./config/index.ts";
import {container} from "./container.ts";
import type {AuthService} from "./modules/auth/domain/auth.service.ts";
import type {IRouter} from "./shared/contracts/router.contract.ts";









const app = express();

app.use(express.json());

app.use(cors);

const appRouter = container.resolve<IRouter>("appRouter");

app.use("/api", appRouter.getRouter());


/*
app.post(
    "/api/users",
    validate({body: createUserDtoSchema}),
    async (req: Request, res: Response) => {
        const userService = container.resolve<UserService>("userService");



        const dto = extractValidatedBodyOrThrow<CreateUserDto>(res);
        const payload = toCreateUserPayload(dto);
        const user = await userService.createUser(payload);
        const response = toCreateUserResponse(user);

        return res.json(response);
    }
);


// Пример эндпоинта для генерации токена
app.post(
    "/api/login",
    validate({body: loginDtoSchema}),
    async (req: Request, res: Response) => {
        console.log("starting login");
        const authService = container.resolve<AuthService>("authService");
        const dto = extractValidatedBodyOrThrow<LoginDto>(res);
        console.log("LoginDto", dto)
        const payload = toLoginPayload(dto);
        const result = await authService.login(payload);
        const response = toLoginResponse(result);

        return res.json(response);
    }
);

app.post(
    "/api/refresh-all-tokens",
    validate({body: refreshAllTokensDtoSchema}),
    (req: Request, res: Response) => {
        const authService = container.resolve<AuthService>("authService")
        const dto = extractValidatedBodyOrThrow<RefreshAllTokensDto>(res);
        const payload = toRefreshAllTokensPayload(dto)
        const result = authService.refreshAllTokens(payload);
        const response = toRefreshAllTokensResponse(result);

        return res.json(response);
    }
);
*/

//Цей ендпойнт поки що не використовується бо валідація токена здійснюється локально на клієнті,
//але може використовуватися при необхідності
app.post("/api/validate-token", (req: Request, res: Response) => {
    /*
    const {accessToken} = req.body;

    const payload = validateAccessToken(accessToken);
    if (payload) {
        return res.json({valid: true});
    }

    return res.json({valid: false});
    */
})


/*
app.get(
    "/api/users",
    authenticateToken,
    authorizeRole(["admin"]),
    validate({query: getUsersListQuerySchema}),
    async (req: Request, res: Response) => {
        const userService = container.resolve<UserService>("userService");



        //Після валідації за допомогою middleware validate() звалідовані параметри запиту FetchUsersParams передаються в res.locals
        const query = extractValidatedQueryOrThrow<GetUsersListQuery>(res);
        const options = toGetUsersListOptions(query);
        const result = await userService.getUsersList(options);
        const response = toGetUsersListResponse(result);

        return res.json(response);
    }
);

app.get(
    "/api/users/me",
    authenticateToken,
    async (req: Request, res: Response) => {
        const userService = container.resolve<UserService>("userService");



        //після успішної автентифікації через middleware authenticateToken payload вхідного jwt-токена передається в res.locals.payload
        console.log(" Starting FetchAuthUserResult");
        const tokenPayload = extractTokenPayloadOrThrow(res);
        const user = await userService.fetchAuthUser(tokenPayload.id);
        const response = toFetchAuthUserResponse(user);

        return res.json(response);
    }
);
 */

/*
app.get(
    "/api/processors",
    authenticateToken,
    validate({query: getProcessorsCatalogParamsSchema}),
    (req: Request, res: Response) => {
        console.log("Starting fetch processors");
        //після валідації даних req.query за допомогою validate(z.object({query: fetchProcessorsParamsSchema})) вони
        // точно відповідають типу FetchProcessorsParams і були передані в res.locals.validatedQuery.query
        const getProcessorsCatalogParams = extractValidatedQueryOrThrow<GetProcessorsCatalogParams>(res);

        const getProcessorsCatalogResponse = getProcessorsCatalog(getProcessorsCatalogParams);

        console.log("minPrice: ", getProcessorsCatalogResponse.minPrice);
        console.log("maxPrice: ", getProcessorsCatalogResponse.maxPrice);

        return res.json(getProcessorsCatalogResponse);
    }
);
*/


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
app.listen(config.port, () => console.log(`Server running on http://localhost:${config.port}`));