


//Функція для перевірки обовязкової наявності поля address.
//Важливий момент - функція має бути function declaration
////Ця ассерція скоріш за все не потрібна, бо маппер буде перевіряти наявність реляцій через схему валідації
/*
export function assertHasAddressOrThrow(user: UserFull): asserts user is UserFull & {address: BaseAddress} {
    if(!user.address) {
        throw new AppError({
            message: `Даних з адресою користувача з id ${user.id} не знайдено`,
            code: "NOT_FOUND",
            statusCode: 404
        });
    }
}
*/






