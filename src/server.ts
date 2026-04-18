import {config} from "./shared/infrastructure/config/index.ts";
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