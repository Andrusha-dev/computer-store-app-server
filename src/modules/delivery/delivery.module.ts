import type {IDeliveryRepository} from "./domain/delivery.repository.contract";
import type {IDeliveryService} from "./application/delivery.service.contract";
import {asClass} from "awilix";
import {DeliveryRepository} from "./infrastructure/database/delivery.repository";
import {DeliveryService} from "./application/delivery.service";




export interface IDeliveryModuleCradle {
    deliveryRepository: IDeliveryRepository;
    deliveryService: IDeliveryService;
}


export const deliveryModuleDeps = {
    deliveryRepository: asClass(DeliveryRepository).singleton(),
    deliveryService: asClass(DeliveryService).singleton()
}