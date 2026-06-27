import type {IProducerRepository} from "./domain/producer.repository.contract";
import type {IProducerService} from "./application/producer.service.contract";
import {asClass, asFunction} from "awilix";
import {ProducerRepository} from "./infrastructure/database/producer.repository";
import {ProducerService} from "./application/producer.service";
import {ProducerController} from "./api/producer.controller";
import {createProducerRouter, type ProducerRouter} from "./api/producer.router";



export interface IProducerModuleCradle {
    producerRepository: IProducerRepository;
    producerService: IProducerService;
    producerController: ProducerController;
    producerRouter: ProducerRouter;
}


export const producerModuleDeps = {
    producerRepository: asClass(ProducerRepository).singleton(),
    producerService: asClass(ProducerService).singleton(),
    producerController: asClass(ProducerController).singleton(),
    producerRouter: asFunction(createProducerRouter).singleton(),
}