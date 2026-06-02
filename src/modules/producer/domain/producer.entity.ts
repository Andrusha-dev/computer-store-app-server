import {type Producer} from "@prisma/client";


export type ProducerEntity = Producer;

//producerInclude та ProducerFullEntity створювати не потрібно бо бізнес логіка не потребує наявності реляції products для producer