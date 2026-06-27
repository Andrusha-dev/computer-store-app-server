import type {IDeliveryRepository} from "../domain/delivery.repository.contract";
import type {IDeliveryService} from "./delivery.service.contract";
import type {DeliveryResponse} from "../api/delivery.dto";
import type {DeliveryEntity} from "../domain/delivery.entity";
import {toDeliveryResponse} from "../api/delivery.mapper";
import {Prisma} from "../../../../prisma/generated/client";



interface Dependencies {
    deliveryRepository: IDeliveryRepository;
}

export class DeliveryService implements IDeliveryService {
    private readonly deliveryRepository: IDeliveryRepository;

    constructor({deliveryRepository}: Dependencies) {
        this.deliveryRepository = deliveryRepository;
    }

    updateTrackingNumber =
        async (id: number, trackingNumber: string, tx?: Prisma.TransactionClient): Promise<DeliveryResponse> => {
            const data: Prisma.DeliveryUpdateInput = {trackingNumber: trackingNumber}

            const delivery: DeliveryEntity = await this.deliveryRepository.update(id, data, tx);
            console.log(`[DELIVERY_SERVICE] Доставці з ID${id} присвоєно ТТН: ${trackingNumber}`);

            const response: DeliveryResponse =toDeliveryResponse(delivery);

            return response;
        }
}