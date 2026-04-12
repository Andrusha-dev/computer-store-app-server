import type {NextFunction, Request, Response, Router} from "express";
import express from "express"
import {cors} from "./api/middlewares/cors.middleware.ts";
import {validate} from "./api/middlewares/validation.middleware.ts";
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
} from "./api/helpers/http.helpers.ts";
import {
        toCreateUserPayload,
        toCreateUserResponse,
        toFetchAuthUserResponse,
        toGetUsersListOptions, toGetUsersListResponse
} from "./modules/user/api/user.mapper.ts";
import {UserService} from "./modules/user/application/user.service.ts";
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
//import {authenticateToken, authorizeRole} from "./shared/types/types.middleware.ts";
import {
        type GetProcessorsCatalogParams,
        getProcessorsCatalogParamsSchema
} from "./types/params/pcComponentParams/processorParams.types.ts";
import {getProcessorsCatalog} from "./modules/pcComponent/domain/processor.service.ts";
import {errorHandler} from "./api/middlewares/error.middleware.ts";
import {config} from "./shared/infrastructure/config/index.ts";
import {container} from "./shared/infrastructure/di/container.ts";
import type {AuthService} from "./modules/auth/application/auth.service.ts";
import type {IRouter} from "./shared/contracts/router.contract.ts";
import {initLoaders} from "./api/loaders/index.ts";
import {setupGracefulShutdown} from "./api/lifecycle/shutdown.ts";











async function bootstrap() {
        try {
                console.log("🚀 Starting bootstrap process...");

                const app = await initLoaders();

                // 3. Тільки після успішних перевірок запускаємо Express
                const server = app.listen(config.port, () => {
                        console.log(`
                                ################################################
                                🛡️  Server listening on port: ${config.port} 🛡️
                                🏢  Environment: ${config.nodeEnv}
                                🚀  Health check: http://localhost:${config.port}/api/health
                                ################################################
                        `);
                });


                setupGracefulShutdown(server);

        } catch (error) {
                console.error("💥 Bootstrap failed:", error);
                process.exit(1);
        }
}

// Виклик головної функції
bootstrap();











/*
const app = express();

app.use(express.json());

app.use(cors);

const appRouter = container.resolve<IRouter>("appRouter");

app.use("/api", appRouter.getRouter());
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



/*Для express js версії 4 потрібно встановити залежність express-async-errors, для автоматичної обробки асинхронних помилок.
В express js версії 5 обробник вже працює з коробки*/
//Глобальний обробник для необроблених помилок
//app.use(errorHandler);


// Запуск сервера
//app.listen(config.port, () => console.log(`Server running on http://localhost:${config.port}`));