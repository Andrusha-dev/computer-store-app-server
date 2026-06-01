import type {IOrderService} from "./order.service.contract.ts";
import type {IOrderRepository} from "../domain/order.repository.contract.ts";
import type {
    CreateOrderDto,
    OrderFullResponse,
    OrdersQuery,
    OrdersResponse, UpdateOrderStatusDto
} from "../api/order.dto.ts";
import type {OrderFullEntity} from "../domain/order.entity.ts";
import {
    BadRequestError,
    ForbiddenError,
    NotFoundError
} from "../../../shared/error/custom.errors.ts";
import {toOrderFullResponse, toOrdersResponse} from "../api/order.mapper.ts";
import {Prisma} from "@prisma/client";
import {toOrderCreateInput, toOrderFindManyArgs, toOrderUpdateInput} from "./order.mapper.ts";
import type {PaginationMeta} from "../../../shared/schemas/pagination.schema.ts";
import {createPaginationMeta} from "../../../shared/utils/pagination.utils.ts";
import type {CartFullResponse, CartItemFullResponse} from "../../cart/api/cart.dto.ts";
import type {IProductService, ProductResponse} from "../../product/index.ts";
import type {ICartService} from "../../cart/index.ts";





interface Dependencies {
    orderRepository: IOrderRepository;
    cartService: ICartService,
    productService: IProductService
}

export class OrderService implements IOrderService {
    private readonly orderRepository: IOrderRepository;
    private readonly cartService: ICartService;
    private readonly productService: IProductService;

    constructor({orderRepository, cartService, productService}: Dependencies) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
        this.productService = productService;
    }

    findMyFullById =
        async (userId: number, id: number): Promise<OrderFullResponse> => {
            const order: OrderFullEntity | null = await this.orderRepository.findFullById(id);

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
            const order: OrderFullEntity | null = await this.orderRepository.findFullById(id);

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
                this.orderRepository.findMany(args),
                //where дістаємо з args, щоб фільтри для findMany та count були синхронізовані
                this.orderRepository.count(args.where)
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
                this.orderRepository.findMany(args),
                //where дістаємо з args, щоб фільтри для findMany та count були синхронізовані
                this.orderRepository.count(args.where)
            ]);

            const content: OrderFullResponse[] = orders.map(toOrderFullResponse);
            const meta: PaginationMeta = createPaginationMeta(query.pageNo, query.pageSize, totalElements);

            const ordersResponse: OrdersResponse = toOrdersResponse(content, meta);

            return ordersResponse;
        }

    create =
        async (userId: number, dto: CreateOrderDto): Promise<OrderFullResponse>  => {
            const cart: CartFullResponse = await this.cartService.findCartFullByUserId(userId);
            if(!cart.items.length) {
                throw new BadRequestError("Неможливо створити замовлення: кошик порожній");
            }

            const {totalAmount, orderItems} = this.prepareOrderDetails(cart)

            const data: Prisma.OrderCreateInput = toOrderCreateInput(userId, totalAmount, orderItems);

            const response: OrderFullResponse = await this.executeOrderTransactionsGroup(userId, cart.items, data);

            return response;
        }

    updateStatus =
        async (id: number, dto: UpdateOrderStatusDto): Promise<OrderFullResponse> => {
            const data: Prisma.OrderUpdateInput = toOrderUpdateInput(dto);
            const order: OrderFullEntity = await this.orderRepository.update(id, data);
            const response: OrderFullResponse = toOrderFullResponse(order);

            return response;
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
    private executeOrderTransactionsGroup =
        async (
            userId: number,
            cartItems: CartItemFullResponse[],
            orderData: Prisma.OrderCreateInput
        ): Promise<OrderFullResponse> => {
            //Список з успішно списаними товарами. quantity - це списана кількість товару
            const successfullyDecreasedItems: {id: number, count: number}[] = [];

            try {
                //Списуємо товари зі складу один за одним
                for (const cartItem of cartItems) {
                    await this.productService.decreaseQuantity(cartItem.productId, cartItem.quantity);
                    //Якщо списання пройшло успішно — запам'ятовуємо id товару та списану кількість
                    successfullyDecreasedItems.push({id: cartItem.productId, count: cartItem.quantity});
                }
                //Створюємо замовлення в БД
                const order: OrderFullEntity = await this.orderRepository.create(orderData);
                //І врешті очищуємо кошик
                await this.cartService.clearCart(userId);

                const response: OrderFullResponse = toOrderFullResponse(order);

                return response;
            } catch (error) {
                //КОМПЕНСАЦІЙНА ДІЯ (Архітектурний відкат)
                //Якщо щось пішло не так під час циклу або створення замовлення,
                //повертаємо назад ЛИШЕ ТІ товари, які встигли списати
                for (const item of successfullyDecreasedItems) {
                    try {
                        await this.productService.increaseQuantity(item.id, item.count);
                    } catch (rollbackError) {
                        console.error(`Критична помилка відкату для товару ${item.id}:`, rollbackError);
                    }
                }

                throw error;
            }
        }
}