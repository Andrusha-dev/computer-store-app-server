import type {IDeliveryRepository} from "../domain/delivery.repository.contract";
import type {IDeliveryService} from "./delivery.service.contract";
import type {DeliveryResponse} from "../api/delivery.dto";
import type {DeliveryEntity} from "../domain/delivery.entity";
import {toDeliveryResponse} from "../api/delivery.mapper";
import {Prisma} from "../../../../prisma/generated/client";
import type {ILoggerService} from "../../../shared/contracts/logger.contract";



interface Dependencies {
    deliveryRepository: IDeliveryRepository;
    logger: ILoggerService;
}

export class DeliveryService implements IDeliveryService {
    private readonly deliveryRepository: IDeliveryRepository;
    private readonly logger: ILoggerService;

    constructor({deliveryRepository, logger}: Dependencies) {
        this.deliveryRepository = deliveryRepository;
        this.logger = logger;
    }

    updateTrackingNumber =
        async (id: number, trackingNumber: string, tx?: Prisma.TransactionClient): Promise<DeliveryResponse> => {
            const data: Prisma.DeliveryUpdateInput = {trackingNumber: trackingNumber}

            const delivery: DeliveryEntity = await this.deliveryRepository.update(id, data, tx);
            this.logger.info(`[DELIVERY_SERVICE] Доставці з ID${id} присвоєно ТТН: ${trackingNumber}`, {deliveryId: delivery.id, trackingNumber: delivery.trackingNumber});

            const response: DeliveryResponse =toDeliveryResponse(delivery);

            return response;
        }
}