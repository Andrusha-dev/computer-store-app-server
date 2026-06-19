import type {
    CreateInvoiceInput,
    CreateInvoiceOutput,
    IPaymentProvider
} from "../../../domain/payment.provider.contract.ts";
import {config} from "../../../../../shared/infrastructure/config/index.ts";
import {BadGatewayError} from "../../../../../shared/error/custom.errors.ts";
import {z} from "zod";
import {AppError} from "../../../../../shared/error/app.error.ts";



const monobankInvoiceResponseSchema = z.object({
    invoiceId: z.string(),
    pageUrl: z.url(),
});

export class MonobankProvider implements IPaymentProvider {
    private readonly token: string;
    private readonly baseUrl: string;
    private readonly isSandbox: boolean;

    constructor() {
        this.token = config.monoApi.token;
        this.baseUrl = config.monoApi.url;
        //sandbox передбачає обовязково наявність режиму, відмінного від production і значення "mock-token" для token.
        //Якщо хоча б одна умова не виконується - здійснюється повноцінна взаємодія з api монобанку, в тому числі, якщо token згенерований в тестовому режимі монобанку
        this.isSandbox = !config.isProduction && this.token === "mock-token";
    }

    createInvoice =
        async (input: CreateInvoiceInput): Promise<CreateInvoiceOutput> => {
            /*
            //Цей блок слід розкоментувати коли потрібно зімітувати помилку сервера монобанку
            if(input.orderId > 0) {
                throw new BadGatewayError("Монобанк тимчасово недоступний (тестова помилка)");
            }
            */

            if(this.isSandbox) {
                console.log(`[Monobank Sandbox] Створення інвойсу для замовлення з ID ${input.orderId} на суму ${input.amount} грн`);
                //Якщо ми в режимі sandbox, то повертаємо результат-заглушку
                const output: CreateInvoiceOutput = {
                    invoiceId: `mock-invoice-${Math.random().toString(36).substring(2, 9)}`,//ключ міститиме випадковий рядок з 7 символів
                    pageUrl: `https://sandbox.monobank.ua/checkout/mock_pay_page_${input.orderId}`
                }

                return output
            }

            try {
                const response = await fetch(`${this.baseUrl}/merchant/invoice/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Token": this.token
                    },
                    body: JSON.stringify({
                        // Monobank приймає суму в копійках (ціле число), тому множимо на 100
                        amount: Math.round(input.amount * 100),
                        ccy: 980, // Код валюти: Гривня (UAH)
                        merchantInvoice: String(input.orderId),
                        redirectUrl: `${config.allowedOrigin.url}/orders/${input.orderId}/payment-success`, //Куди повернути клієнта після оплати
                        webHookUrl: `${config.allowedOrigin.url}/api/payments/webhook/monobank`, //Сюди Моно пришле сповіщення про успішну оплату
                    }),
                });

                if(!response.ok) {
                    const errorText: string = await response.text();
                    console.error(`Monobank API помилка: ${response.status} - ${errorText}`);
                    throw new BadGatewayError("Монобанк відхилив запит на створення інвойсу")
                }

                //Отримуємо сирі дані від Моно
                const data = await response.json();

                //Валідуємо вхідні дані. Використовуємо safeParse щоб згенерувати BadGatewayError, а не помилку zod
                const result = monobankInvoiceResponseSchema.safeParse(data);
                if(!result.success) {
                    //Якщо Моно прислав не те — логуємо сирі помилки Zod для розробника у консоль...
                    console.error("[Monobank Schema Mismatch]:", z.treeifyError(result.error));
                    throw new BadGatewayError("Формат даних, отриманих з API монобанку не відповідає очікуваним")
                }

                //Мапимо відповідь у наш чистий формат з контракту (CreateInvoiceOutput)
                const output: CreateInvoiceOutput = {
                    invoiceId: result.data.invoiceId,
                    pageUrl: result.data.pageUrl,
                }

                return output;
            } catch (error) {
                if(error instanceof AppError) {
                    throw error;
                }
                // Якщо сталася мережева помилка (fetch впав, немає інтернету, таймаут)
                console.error("[Monobank Provider Error]:", error);
                throw new BadGatewayError("Не вдалося зв'язатися з сервісом Monobank");
            }
        }
}