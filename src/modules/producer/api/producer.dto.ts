import {z} from "zod";
import {paginationCriteriaSchema, paginationMetaSchema} from "../../../shared/schemas/pagination.schema";




//ОСНОВНІ СХЕМИ (БУДІВЕЛЬНІ БЛОКИ)
//Основна схема producer
const producerSchema = z.object({
    id: z.number().int().positive(),
    name: z.string().min(2, {error: "Назва виробника має містити не менше 2 символів"}),
    logoUrl: z.url().nullable()
});



//INPUT
const baseProducerDtoSchema = producerSchema.omit({id: true});


export const createProducerDtoSchema = baseProducerDtoSchema
    .extend({
        logoUrl: producerSchema.shape.logoUrl.optional()
    });
export type CreateProducerDto = z.infer<typeof createProducerDtoSchema>;


export const updateProducerDtoSchema = baseProducerDtoSchema.partial();
export type UpdateProducerDto = z.infer<typeof updateProducerDtoSchema>;


export const producerParamsSchema = z.object({
    id: z.coerce.number().int().positive()
});
export type ProducerParams = z.infer<typeof producerParamsSchema>;


export const producerFiltersSchema = z.object({
    name: z.string().optional()
});
export type ProducerFilters = z.infer<typeof producerFiltersSchema>;
export const producerSortTypeSchema = producerSchema
    .pick({name: true})
    .keyof()
    .default("name");
export type ProducerSortType = z.infer<typeof producerSortTypeSchema>;
export const producersQuerySchema = paginationCriteriaSchema
    .extend({
        sortType: producerSortTypeSchema,
    })
    .extend(producerFiltersSchema.shape);
export type ProducersQuery = z.infer<typeof producersQuerySchema>;



//OUTPUT
export const producerResponseSchema = producerSchema;
export type ProducerResponse = z.infer<typeof producerResponseSchema>;

//producerFullResponseSchema не потрібен, бо контракти response не вимагають наявності в них реляції products

export const producersResponseSchema = z.object({
    content: z.array(producerResponseSchema),
    meta: paginationMetaSchema,
});
export type ProducersResponse = z.infer<typeof producersResponseSchema>;

