import type {IProducerRepository} from "./domain/producer.repository.contract.ts";
import type {IProducerService} from "./application/producer.service.contract.ts";
import type {IProducerController} from "./api/producer.controller.contract.ts";
import type {Router} from "express";
import {asClass, asFunction} from "awilix";
import {ProducerRepository} from "./infrastructure/database/producer.repository.ts";
import {ProducerService} from "./application/producer.service.ts";
import {ProducerController} from "./api/producer.controller.ts";
import {createProducerRouter} from "./api/producer.router.ts";



export interface IProducerModuleCradle {
    producerRepository: IProducerRepository;
    producerService: IProducerService;
    producerController: IProducerController;
    producerRouter: Router
}


export const producerModuleDeps = {
    producerRepository: asClass(ProducerRepository).singleton(),
    producerService: asClass(ProducerService).singleton(),
    producerController: asClass(ProducerController).singleton(),
    producerRouter: asFunction(createProducerRouter).singleton(),
}