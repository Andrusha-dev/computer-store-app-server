import {type NextFunction, type Request, type Response} from "express";
import {config} from "../../shared/infrastructure/config";
import {BadRequestError, ForbiddenError} from "../../shared/error/custom.errors.ts";
import crypto from "crypto"




//Мідлвара для валідації запиту від вебхука монобанку (за принципом алгоритмів на еліптичних кривих ECDSA)
export const verifyMonobankSignature = (req: Request, res: Response, next: NextFunction): void => {
    //Sandbox режим (використовуємо імпортований конфіг). Ігноруємо подальшу верифікацію і передаємо запит далі
    if (!config.isProduction && config.monoApi.token === "mock-token") {
        next();
        return; //Вказуєм return, щоб мідлвара припинила далі виконуватись
    }

    const xSign = req.headers["x-sign"];

    if (!xSign || typeof xSign !== "string") {
        throw new BadRequestError("Отримано вебхук від Монобанку без заголовка x-sign!")
    }

    const rawBody = req.rawBody;

    if (!rawBody) {
        throw new BadRequestError("Тіло запиту відсутнє");
    }


    const verifier = crypto.createVerify("sha256");
    verifier.update(rawBody);

    // Перевіряємо через публічний ключ з імпортованого конфігу
    const isValid = verifier.verify(config.monoApi.pubKey, xSign, "base64");

    if (!isValid) {
        throw new ForbiddenError("Підпис X-Sign не збігається!");
    }

    next();
}