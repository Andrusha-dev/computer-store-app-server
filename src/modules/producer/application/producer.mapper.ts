import type {CreateProducerDto, ProducerFilters, ProducersQuery, UpdateProducerDto} from "../api/producer.dto";
import {Prisma} from "../../../../prisma/generated/client";




export const toProducerWhereInput =
    (filters: ProducerFilters): Prisma.ProducerWhereInput => {
        const where: Prisma.ProducerWhereInput = {
            name: filters.name
                ? { contains: filters.name, mode: 'insensitive' }
                : undefined
        }

        return where;
    }

export const toProducerFindManyArgs =
    (query: ProducersQuery): Prisma.ProducerFindManyArgs => {
        const {pageNo, pageSize, sortType, sortOrder, ...filters} = query;

        const where: Prisma.ProducerWhereInput = toProducerWhereInput(filters);

        const args: Prisma.ProducerFindManyArgs = {
            where: where,
            orderBy: {
                [sortType]: sortOrder
            },
            take: pageSize,
            skip: pageNo * pageSize,
        }

        return args;
    }

export const toProducerCreateInput =
    (dto: CreateProducerDto): Prisma.ProducerCreateInput => {
        const data: Prisma.ProducerCreateInput = {
            ...dto
        }

        return data;
    }

export const toProducerUpdateInput =
    (dto: UpdateProducerDto): Prisma.ProducerUpdateInput => {
        const data: Prisma.ProducerUpdateInput = {
            ...dto
        }

        return data;
    }