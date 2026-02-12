import { z } from 'zod';
import {AddressSchema, UserRoleSchema, UserSchema} from "../generated/index.ts";
// Імпортуємо ЗГЕНЕРОВАНІ схеми
//import { UserSchema, AddressSchema, UserRoleSchema } from '../generated/zod';



//Тип для ролей користувачів
export const userRoleSchema = UserRoleSchema;
export type UserRole = z.infer<typeof userRoleSchema>

// 1. Розширюємо Address (прибираємо ID, бо клієнт його не шле при створенні)
export const baseAddressSchema = AddressSchema.omit({ id: true});
export type BaseAddress = z.infer<typeof baseAddressSchema>;

// 2. Основна схема User
// Ми беремо згенеровану Prisma схему і "уточнюємо" (extend) поле phone,
// тому що в schema.prisma незручно писати складні Regex
export const baseUserSchema = UserSchema
    .omit({
        addressId: true}
    )
    .extend({
        phone: z.string()
            .length(17, "Довжина номеру телефона має бути не меншу 17 символів")
            .regex(/^\+38\(0\d{2}\)\d{3}-\d{2}-\d{2}$/, "Номер телефону не відповідає формату +38(0XX)XXX-XX-XX"),

        // Переписуємо address, щоб це був вкладений об'єкт, а не просто ID
        address: baseAddressSchema,
});
export type BaseUser = z.infer<typeof baseUserSchema>;

// Тип для способу сортування користувачів
export const userSortTypeSchema = baseUserSchema.pick({ firstname: true, lastname: true }).keyof();
export type UserSortType = z.infer<typeof userSortTypeSchema>;




/*
// Реєстрація (MultiStepFormValues)
// Omit id та role (вони є в базі, але не у формі реєстрації)
export const multistepFormValuesSchema = domainUserSchema.omit({ id: true, role: true});
export type MultiStepFormValues = z.infer<typeof multistepFormValuesSchema>;

// Логін (LoginFormValues)
export const loginFormValuesSchema = domainUserSchema.pick({ email: true, password: true });
export type LoginFormValues = z.infer<typeof loginFormValuesSchema>;

// UserWithoutPassword (для відповіді клієнту)
export const userWithoutPasswordSchema = domainUserSchema.omit({ password: true });
export type UserWithoutPassword = z.infer<typeof userWithoutPasswordSchema>;
 */