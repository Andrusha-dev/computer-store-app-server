import type {IDeliveryRepository} from "./domain/delivery.repository.contract.ts";
import type {IDeliveryService} from "./application/delivery.service.contract.ts";
import {asClass} from "awilix";
import {DeliveryRepository} from "./infrastructure/database/delivery.repository.ts";
import {DeliveryService} from "./application/delivery.service.ts";




export interface IDeliveryModuleCradle {
    deliveryRepository: IDeliveryRepository;
    deliveryService: IDeliveryService;
}


export const deliveryModuleDeps = {
    deliveryRepository: asClass(DeliveryRepository).singleton(),
    deliveryService: asClass(DeliveryService).singleton()
}