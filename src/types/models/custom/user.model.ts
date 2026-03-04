import { z } from 'zod';
import {AddressSchema, UserRoleSchema, UserSchema} from "../generated/index.ts";





// --- 2. АТОМАРНІ СХЕМИ (Building Blocks) ---
export const baseAddressSchema = AddressSchema.omit({ id: true });
export interface BaseAddress extends z.infer<typeof baseAddressSchema>{}

// --- 3. SCALARS: ЧИСТИЙ КОРИСТУВАЧ (Без пароля та зв'язків) ---
export const baseUserSchema = UserSchema.omit({
    addressId: true,
    password: true,
}).extend({
    phone: z.string()
        .length(17, "Довжина номеру телефона має бути 17 символів")
        .regex(/^\+38\(0\d{2}\)\d{3}-\d{2}-\d{2}$/, "Формат: +38(0XX)XXX-XX-XX"),
});
export interface BaseUser extends z.infer<typeof baseUserSchema>{}



// --- 4. RELATIONS: КАТАЛОГ ЗВ'ЯЗКІВ ---

// Еталон (Strict): Все обов'язкове. Використовуйте для CreateArgs або UserResponse.
export const baseUserRelationsSchema = z.object({
    address: baseAddressSchema,
    // orders: baseOrderSchema, // легко додати сюди
});
export interface BaseUserRelations extends z.infer<typeof baseUserRelationsSchema>{}

// Опціональні (Prisma-ready): Для використання в доменній сутності.
// Використовуємо .nullish() для кожного поля, щоб покрити і null, і undefined від Prisma.
export const baseUserOptionalRelationsSchema = baseUserRelationsSchema
    .partial()
    .extend({
        address: baseUserRelationsSchema.shape.address.nullish()
        //orders: baseUserRelationsSchema.shape.orders.optional(), //Хоча це поле можна і не вказувати, бо partial() вже додав .optional()
    });
export interface BaseUserOptionalRelations extends z.infer<typeof baseUserOptionalRelationsSchema>{}

// --- 5. ENTITIES: ГОЛОВНІ СУТНОСТІ ---

// Головна сутність для сервісів (Чиста, без пароля, з опціональними зв'язками)
export const userEntitySchema = baseUserSchema.merge(baseUserOptionalRelationsSchema);
export interface UserEntity extends z.infer<typeof userEntitySchema>{}



// --- 6. ДОДАТКОВІ БІЗНЕС ТИПИ ---
//Додатковий бізнес тип
export const userWithAddressSchema = baseUserSchema.extend({
    address: baseUserRelationsSchema.shape.address
});
export interface UserWithAddress extends z.infer<typeof userWithAddressSchema>{}


// --- 7. ДОПОМІЖНІ ТИПИ ---

//ТИПИ РОЛЕЙ ТА СОРТУВАННЯ ---
export const userSortTypeSchema = baseUserSchema.pick({ firstname: true, lastname: true }).keyof();
export type UserSortType = z.infer<typeof userSortTypeSchema>;
export const userRoleSchema = UserRoleSchema;
export type UserRole = z.infer<typeof userRoleSchema>;

