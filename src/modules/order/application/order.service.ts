import type {IOrderService} from "./order.service.contract";
import type {IOrderRepository} from "../domain/order.repository.contract";
import type {
    CheckoutResponse,
    CreateOrderDto,
    OrderFullResponse,
    OrdersQuery,
    OrdersResponse, RetryPaymentResponse
} from "../api/order.dto";
import type {OrderFullEntity} from "../domain/order.entity";
import {
    BadRequestError,
    ForbiddenError,
    NotFoundError
} from "../../../shared/error/custom.errors";
import {toOrderFullResponse, toOrdersResponse} from "../api/order.mapper";
import {toOrderCreateInput, toOrderFindManyArgs} from "./order.mapper";
import type {PaginationMeta} from "../../../shared/schemas/pagination.schema";
import {createPaginationMeta} from "../../../shared/utils/pagination.utils";
import type {CartFullResponse, CartItemFullResponse} from "../../cart/api/cart.dto";
import type {IProductService, ProductResponse} from "../../product/index";
import type {ICartService} from "../../cart/index";
import type {PrismaService} from "../../../shared/infrastructure/database/prisma.service";
import type {IPaymentService} from "../../payment/domain/payment.service.contract";
import type {IDeliveryService} from "../../delivery/application/delivery.service.contract";
import type {CreateInvoiceResponse} from "../../payment/api/payment.dto";
import {Prisma} from "../../../../prisma/generated/client";
import type {ILoggerService} from "../../../shared/contracts/logger.contract";





interface Dependencies {
    dbService: PrismaService;
    orderRepository: IOrderRepository;
    cartService: ICartService,
    productService: IProductService,
    paymentService: IPaymentService,
    deliveryService: IDeliveryService,
    logger: ILoggerService,
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
            this.deps.logger.info(
                `[ORDER_SERVICE] Замовлення успішно створено. ID ${orderFullEntity.id}. Статус ${orderFullEntity.status}`,
                {orderId: orderFullEntity.id, status: orderFullEntity.status})
            const orderFullResponse: OrderFullResponse = toOrderFullResponse(orderFullEntity);

            let paymentUrl: string | null = null;

            if (orderFullResponse.payment.method === "CARD") {
                try {
                    paymentUrl = await this.initiateOrderPayment(orderFullResponse);
                } catch (error) {
                    //Гасимо помилку, щоб повернути клієнту успішно створене замовлення з paymentUrl: null
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

            const paymentUrl: string = await this.initiateOrderPayment(order);

            const retryPaymentResponse: RetryPaymentResponse = {
                paymentUrl: paymentUrl
            }

            return  retryPaymentResponse;
        }

    // Додавання номеру декларації для payment та відповідна зміна статусу замовлення на DELIVERING (метод для адмінів)
    setTrackingNumber = async (id: number, trackingNumber: string): Promise<OrderFullResponse> => {
        const {delivery, payment} = await this.findFullById(id);

        return await this.deps.dbService.$transaction(async (tx) => {
            //Якщо метод оплати "CARD", то перевіряємо чи замовлення оплачене
            if(payment.method === "CARD" && payment.status !== "PAID") {
                throw new BadRequestError(`Неможливо здійснити доставку замовлення при оплаті картою, якщо воно не оплачене. Статус оплати ${payment.status}`)
            }

            //Викликаємо сервіс доставки, щоб він оновив ТТН у своїй таблиці
            await this.deps.deliveryService.updateTrackingNumber(delivery.id, trackingNumber, tx);

            const data: Prisma.OrderUpdateInput = {status: "DELIVERING"}
            // Також змінюємо статус самого замовлення, бо його вже відправлено!
            const updatedOrder: OrderFullEntity = await this.deps.orderRepository.update(id, data, tx);
            this.deps.logger.info(
                `[ORDER_SERVICE] Статус замовлення успішно оновлено до ${updatedOrder.status}`,
                {orderId: updatedOrder.id, status: updatedOrder.status}
            );

            const response: OrderFullResponse = toOrderFullResponse(updatedOrder);

            return response;
        });
    }

    //Онвлення статусу замовлення (для вебхуку монобанку в PaymentService)
    updateStatusToPaid =
        async (id: number): Promise<OrderFullResponse> => {
            const {payment, status} = await this.findFullById(id);

            if(status !== "PENDING") {
                throw new BadRequestError(`Неможливо оплатити замовлення в статусі ${status}`)
            }

            if(payment.status !== "PAID") {
                throw new BadRequestError(`Неможливо перевести замовлення в статус PAID, оскільки платіж у банку не підтверджено!`);
            }

            const data: Prisma.OrderUpdateInput = {status: "PAID"}
            const order: OrderFullEntity = await this.deps.orderRepository.update(id, data);
            this.deps.logger.info(
                `[ORDER_SERVICE] Статус замовлення успішно оновлено до ${order.status}`,
                {orderId: order.id, status: order.status}
            );
            const response: OrderFullResponse = toOrderFullResponse(order);

            return response;
        }

    //Метод для адмінів. Виконує зміну статусу на "COMPLETED", коли користувач отримав замовлення
    updateStatusToCompleted =
        async (id: number): Promise<OrderFullResponse> => {
            const {status} = await this.findFullById(id);

            if(status !== "DELIVERING") {
                throw new BadRequestError(`Не можна завершити замовлення зі статусом ${status}. Воно має бути спочатку відправлене`);
            }

            const data: Prisma.OrderUpdateInput = {status: "COMPLETED"}
            const orderFullEntity: OrderFullEntity = await this.deps.orderRepository.update(id, data);
            this.deps.logger.info(
                `[ORDER_SERVICE] Статус замовлення успішно оновлено до ${orderFullEntity.status}`,
                {orderId: orderFullEntity.id, status: orderFullEntity.status}
            )

            const response: OrderFullResponse = toOrderFullResponse(orderFullEntity);

            return response;
        }

    //Метод для скасування замовлення (використовується в PaymentService, коли платіж зафейлився, або користувач вчасно не оплатив його, або коли відбулось повернення коштів користувачу)
    //Викликається у відповідь на вебхук монобанк (якщо метод оплати "CARD") або адміном (якщо метод оплати "CASH") Передбачає зміну статусу замовлення на CANCELLED та повернення товару на склад
    cancelOrder =
        async (id: number): Promise<OrderFullResponse> => {
            const {items, payment} = await this.findFullById(id);

            //Якщо оплата картою, то можна скасувати лише замовлення статус оплати якого "FAILED" або "REFUNDED"
            if(payment.method === "CARD") {
                //Стандартний запобіжник для виклику за межами вебхуку. Не можна скасувати замовлення, яке вже оплачене, або яке вже передане перевізнику
                if(payment.status !== "FAILED" && payment.status !== "REFUNDED") {
                    throw new BadRequestError(`Неможливо скасувати замовлення, при оплаті карткою, якщо оплата не скасована`)
                }
            }


            //Якщо метод оплати "CASH", то скасування замовлення можна робити при будь-якому статусі замовлення
            //(окрім "PAID", але якщо метод оплати "CASH", то замовлення фізично не може мати статус "PAID")

            //Якщо все ок - скасовуємо замовлення
            return await this.deps.dbService.$transaction(async (tx) => {
                //Повертаємо товари на склад
                for (const item of items) {
                    await this.deps.productService.increaseQuantity(item.productId, item.quantity, tx);
                }

                //Змінюємо статус замовлення на CANCELLED
                const data: Prisma.OrderUpdateInput = {status: "CANCELLED"}
                const orderFullEntity: OrderFullEntity = await this.deps.orderRepository.update(id, data, tx);
                this.deps.logger.info(
                    `[ORDER_SERVICE] Статус замовлення успішно змінене на ${orderFullEntity.status}`,
                    {orderId: orderFullEntity.id, status: orderFullEntity.status}
                );

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

                //Перевіряємо чи відповідає кількість замовленого товару фактичній кількості на складі
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

    //Приватний метод для створення інвойсу. Викликається в методі create після створення замовлення, та в методі retryPayment (якщо після створення замовлення не вдалось створити інвойс).
    private initiateOrderPayment =
        async (order: OrderFullResponse): Promise<string> => {
            if(order.payment.method !== "CARD") {
                throw new BadRequestError(`Замовлення з ID ${order.id} не передбачає оплату карткою`);
            }

            if(order.payment.status === "PAID") {
                throw new BadRequestError(`Замовлення з ID ${order.id} вже оплачене`);
            }

            //const totalAmount: number = order.payment.amount + order.delivery.price; //Якщо доставка курєром то загальна сума оплати має включати суму замовлення та суму доставки

            const createInvoiceResponse: CreateInvoiceResponse = await this.deps.paymentService.createInvoice(
                order.id,
                order.payment.id,
                order.payment.amount, //Тут соріш за все потрібно буде вказати саме totalAmount
            );

            return createInvoiceResponse.paymentUrl;
        }
}