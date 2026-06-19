import type {IOrderService} from "./order.service.contract.ts";
import type {IOrderRepository} from "../domain/order.repository.contract.ts";
import type {
    CheckoutResponse,
    CreateOrderDto,
    OrderFullResponse,
    OrdersQuery,
    OrdersResponse, RetryPaymentResponse, UpdateOrderStatusDto
} from "../api/order.dto.ts";
import type {OrderFullEntity} from "../domain/order.entity.ts";
import {
    BadGatewayError,
    BadRequestError,
    ForbiddenError,
    NotFoundError
} from "../../../shared/error/custom.errors.ts";
import {toOrderFullResponse, toOrdersResponse} from "../api/order.mapper.ts";
import {Prisma} from "@prisma/client";
import {toOrderCreateInput, toOrderFindManyArgs} from "./order.mapper.ts";
import type {PaginationMeta} from "../../../shared/schemas/pagination.schema.ts";
import {createPaginationMeta} from "../../../shared/utils/pagination.utils.ts";
import type {CartFullResponse, CartItemFullResponse} from "../../cart/api/cart.dto.ts";
import type {IProductService, ProductResponse} from "../../product/index.ts";
import type {ICartService} from "../../cart/index.ts";
import type {PrismaService} from "../../../shared/infrastructure/database/prisma.service.ts";
import type {IPaymentService} from "../../payment/domain/payment.service.contract.ts";
import type {IDeliveryService} from "../../delivery/application/delivery.service.contract.ts";
import type {CreateInvoiceResponse} from "../../payment/api/payment.dto.ts";





interface Dependencies {
    dbService: PrismaService;
    orderRepository: IOrderRepository;
    cartService: ICartService,
    productService: IProductService,
    paymentService: IPaymentService,
    deliveryService: IDeliveryService
}

export class OrderService implements IOrderService {
    private readonly deps: Dependencies;

    constructor(dependencies: Dependencies) {
        this.deps = dependencies;
    }

    findMyFullById =
        async (userId: number, id: number): Promise<OrderFullResponse> => {
            const order: OrderFullEntity | null = await this.deps.orderRepository.findFullById(id);

            //Перевіряєм чи існує замовлення
            if(!order) {
                throw new NotFoundError(`Замовлення з ID ${id} не знайдено`);
            }

            //Перевіряєм чи замовлення належить поточному користувачу
            if(order.userId !== userId) {
                throw new ForbiddenError(`Замовлення з ID ${id} не належить поточному користувачу`);
            }

            const response: OrderFullResponse = toOrderFullResponse(order);

            return response;
        }

    findFullById =
        async (id: number): Promise<OrderFullResponse> => {
            const order: OrderFullEntity | null = await this.deps.orderRepository.findFullById(id);

            //Перевіряєм чи існує замовлення
            if(!order) {
                throw new NotFoundError(`Замовлення з ID ${id} не знайдено`);
            }

            const response: OrderFullResponse = toOrderFullResponse(order);

            return response;
        }

    findMyMany =
        async (userId: number, query: OrdersQuery): Promise<OrdersResponse> => {
            const args: Prisma.OrderFindManyArgs = toOrderFindManyArgs(query, userId);

            const [orders, totalElements] = await Promise.all([
                this.deps.orderRepository.findMany(args),
                //where дістаємо з args, щоб фільтри для findMany та count були синхронізовані
                this.deps.orderRepository.count(args.where)
            ]);

            const content: OrderFullResponse[] = orders.map(toOrderFullResponse);
            const meta: PaginationMeta = createPaginationMeta(query.pageNo, query.pageSize, totalElements);

            const ordersResponse: OrdersResponse = toOrdersResponse(content, meta);

            return ordersResponse;
        }

    findMany =
        async (query: OrdersQuery): Promise<OrdersResponse> => {
            const args: Prisma.OrderFindManyArgs = toOrderFindManyArgs(query);

            const [orders, totalElements] = await Promise.all([
                this.deps.orderRepository.findMany(args),
                //where дістаємо з args, щоб фільтри для findMany та count були синхронізовані
                this.deps.orderRepository.count(args.where)
            ]);

            const content: OrderFullResponse[] = orders.map(toOrderFullResponse);
            const meta: PaginationMeta = createPaginationMeta(query.pageNo, query.pageSize, totalElements);

            const ordersResponse: OrdersResponse = toOrdersResponse(content, meta);

            return ordersResponse;
        }

    create =
        async (userId: number, dto: CreateOrderDto): Promise<CheckoutResponse>  => {
            const cart: CartFullResponse = await this.deps.cartService.findCartFullByUserId(userId);
            if(!cart.items.length) {
                throw new BadRequestError("Неможливо створити замовлення: кошик порожній");
            }

            const {totalAmount, orderItems} = this.prepareOrderDetails(cart)
            const data: Prisma.OrderCreateInput = toOrderCreateInput(userId, totalAmount, orderItems, dto);

            const orderFullEntity: OrderFullEntity = await this.executeOrderCreationTransaction(userId, cart.items, data);
            const orderFullResponse: OrderFullResponse = toOrderFullResponse(orderFullEntity);

            let paymentUrl: string | null = null;

            try {
                paymentUrl = await this.initiateOrderPayment(orderFullResponse);
            } catch (error) {
                //Гасимо помилку, щоб повернути клієнту успішно створене замовлення з paymentUrl: null
                if (error instanceof BadGatewayError) {
                    //Якщо це помилка банку
                    console.error(`[BANK_DOWN] Монобанк не відповів для замовлення ${orderFullResponse.id}`);
                } else if (!(error instanceof BadRequestError)) {
                    //Помилку BadRequestError ми не логуємо, бо це зайве. Методом виключення логуємо помилку бд
                    console.error(`[CRITICAL_DATABASE_ERROR] Інвойс в банку створено, але не вдалося оновити externalId для платежу замовлення ${orderFullResponse.id}. Помилка:`, error);
                }
            }

            //Якщо замовлення успішно створено, то, незалежно від того чи була помилка під час створення інвойсу,
            //чи метод оплати "CASH", відповідь має містити поле paymentUrl, тому ми повертаємо
            const response: CheckoutResponse = {
                order: orderFullResponse,
                paymentUrl: paymentUrl
            }

            return response;
        }

    //Метод для повторної спроби генерації інвойсу (для користувача). Використовується для випадків, коли це не вдалось під час створення замовлення
    retryPayment =
        async (orderId: number, userId: number): Promise<RetryPaymentResponse> => {
            const order: OrderFullResponse = await this.findMyFullById(userId, orderId);

            try {
                const paymentUrl: string = await this.initiateOrderPayment(order);
                const retryPaymentResponse: RetryPaymentResponse = {
                    paymentUrl: paymentUrl
                }

                return  retryPaymentResponse;
            } catch (error) {
                if (error instanceof BadGatewayError) {
                    //Якщо це помилка банку BadGatewayError — логуємо.
                    console.error(`[BANK_DOWN] Монобанк не відповів під час повторної оплати замовлення ${order.id}`);
                } else if (!(error instanceof BadRequestError)) {
                    //Помилку BadRequestError ми не логуємо, бо це зайве. Методом виключення логуємо помилку бд
                    console.error(`[CRITICAL_DATABASE_ERROR] Під час повторної оплати інвойс створено, але не оновлено externalId для замовлення ${order.id}. Помилка:`, error);
                }

                // Прокидуємо далі, щоб клієнт отримав чесний статус (502 або 500)
                throw error;
            }
        }

    //Онвлення статусу замовлення (для адмінів)
    updateStatus =
        async (id: number, dto: UpdateOrderStatusDto): Promise<OrderFullResponse> => {
            const data: Prisma.OrderUpdateInput = {status: dto.status}//toOrderUpdateInput(dto);
            const order: OrderFullEntity = await this.deps.orderRepository.update(id, data);
            const response: OrderFullResponse = toOrderFullResponse(order);

            return response;
        }

    // Додавання номеру декларації для payment та відповідна зміна статусу замовлення на DELIVERING (метод для адмінів)
    setTrackingNumber = async (id: number, trackingNumber: string): Promise<OrderFullResponse> => {
        const order: OrderFullEntity | null = await this.deps.orderRepository.findFullById(id);
        if (!order) {
            throw new NotFoundError(`Замовлення з ID ${id} не знайдено`);
        }

        return await this.deps.dbService.$transaction(async (tx) => {
            //Перевіряємо доставку на null
            if (!order.delivery) {
                throw new BadRequestError(`Для замовлення з ID ${id} не знайдено інформації про доставку`);
            }

            //Викликаємо сервіс доставки, щоб він оновив ТТН у своїй таблиці
            await this.deps.deliveryService.updateTrackingNumber(order.delivery.id, trackingNumber, tx);

            const data: Prisma.OrderUpdateInput = {status: "DELIVERING"}
            // Також змінюємо статус самого замовлення, бо його вже відправлено!
            const updatedOrder: OrderFullEntity = await this.deps.orderRepository.update(id, data, tx);

            const response: OrderFullResponse = toOrderFullResponse(updatedOrder);

            return response;
        });
    }

    //Метод для скасування замовлення (використовується в PaymentService, коли платіж зафейлився, або користувач не вчасно не оплатив його)
    cancelOrder =
        async (id: number): Promise<OrderFullResponse> => {
            const {status, items} = await this.findFullById(id);

            //Запобіжник. Не можна скасувати замовлення, яке вже оплачене, або яке вже передане перевізнику
            if(status === "PAID" || status === "DELIVERING") {
                throw new BadRequestError(`Неможливо скасувати замовлення в статусі ${status}`)
            }

            return await this.deps.dbService.$transaction(async (tx) => {
                //Повертаємо товари на склад
                for (const item of items) {
                    console.log(`[ORDER_SERVICE] Повертаємо товар ${item.productId} на склад у кількості ${item.quantity}`);
                    await this.deps.productService.increaseQuantity(item.productId, item.quantity, tx);
                }

                //Змінюємо статус замовлення на CANCELLED
                const data: Prisma.OrderUpdateInput = {status: "CANCELLED"}
                const orderFullEntity: OrderFullEntity = await this.deps.orderRepository.update(id, data, tx);

                console.log(`[ORDER_SERVICE] Замовлення з ID ${id} успішно скасовано, товар повернуто.`);
                const response: OrderFullResponse = toOrderFullResponse(orderFullEntity);

                return response;
            })
        }


    //Приватний метод для формування загальної суми замовлення (totalAmount) та списку елементів замовлення (items)
    private prepareOrderDetails =
        (cart: CartFullResponse) => {
            let totalAmount: number = 0;
            //Тип Prisma.OrderItemCreateWithoutOrderInput[], тому, що Order іще не існує, тому поле order в OrderItem створювати не потрібно
            const orderItems: Prisma.OrderItemCreateWithoutOrderInput[] = [];

            for (const cartItem of cart.items) {
                const product: ProductResponse = cartItem.product;

                //Первіряємо чи відповідає кількість замовленого товару фактичній кількості на складі
                if (product.quantity < cartItem.quantity) {
                    throw new BadRequestError(`Не достатньо товару ${product.productName} на складі. Доступно ${product.quantity}`);
                }

                //Додаємо вартість позиції до загальної суми замовлення
                totalAmount += cartItem.quantity * product.price;

                //Створюємо OrderItem
                ////Тип Prisma.OrderItemCreateWithoutOrderInput, тому, що Order іще не існує, тому поле order в OrderItem створювати не потрібно
                const orderItem: Prisma.OrderItemCreateWithoutOrderInput = {
                    quantity: cartItem.quantity,
                    price: product.price,
                    product: {
                        connect: {id: product.id}
                    }
                }

                //додаємо OrderItem до загального списку
                orderItems.push(orderItem);
            }

            return {
                totalAmount: totalAmount,
                orderItems: orderItems
            }
        }

    //Приватний метод для виконання групи транзакцій замовлення: списання кількості продуктів, створення замовлення та очищення кошика
    //з можливістю відкату (компенсації) у випадку, якщо перші дві транзакції завершились помилкою
    private executeOrderCreationTransaction =
        async (
            userId: number,
            cartItems: CartItemFullResponse[],
            orderData: Prisma.OrderCreateInput
        ): Promise<OrderFullEntity> => {
            return await this.deps.dbService.$transaction(async (tx) => {
                for (const cartItem of cartItems) {
                    await this.deps.productService.decreaseQuantity(cartItem.productId, cartItem.quantity, tx);
                }

                const orderFullEntity: OrderFullEntity = await this.deps.orderRepository.create(orderData, tx);

                await this.deps.cartService.clearCart(userId, tx);

                return orderFullEntity;
            });
        }

    //Приватний метод для створення інвойсу. Викликається в методі create після створення замовлення, та в методі retryPayment.
    private initiateOrderPayment =
        async (order: OrderFullResponse): Promise<string> => {
            if(order.payment.method !== "CARD") {
                throw new BadRequestError(`Замовлення з ID ${order.id} не передбачає оплату карткою`);
            }

            if(order.payment.status === "PAID") {
                throw new BadRequestError(`Замовлення з ID ${order.id} вже оплачене`);
            }

            const createInvoiceResponse: CreateInvoiceResponse = await this.deps.paymentService.createInvoice(
                order.id,
                order.payment.id,
                order.payment.amount,
            );

            return createInvoiceResponse.paymentUrl;
        }
}