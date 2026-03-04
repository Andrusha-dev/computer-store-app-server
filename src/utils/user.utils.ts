import type {UserEntity} from "../types/models/custom/user.model.ts";
import {AppError} from "../error/appError.ts";

export const assertAddressOrThrow = (user: UserEntity): void => {
    if(!user.address) {
        throw new AppError({
            message: `Даних з адресою користувача з id ${user.id} не знайдено`,
            code: "INTERNAL_SERVER_ERROR",
            statusCode: 500
        });
    }
}