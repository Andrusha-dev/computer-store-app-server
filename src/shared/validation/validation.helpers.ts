import type {QueryParams} from "../http/express.types.ts";


//Метод для попередньої обробки обєкту з параметрами запиту queryParams, а саме прибирання квадратних дужок в назвах полів
//для можливості подальшої валідації
export const normalizeQueryParams = (queryParams: Record<string, any>): QueryParams => {
    const normalizedQueryParams: QueryParams = {};
    Object.keys(queryParams).forEach((key) => {
        const value = queryParams[key];
        if(typeof value === "string" || Array.isArray(value) && value.every((item) => typeof item === "string") || typeof value === "undefined") {
            const newKey = key.replace("[]", "");
            normalizedQueryParams[newKey] = value;
        } else {
            console.log("Type of value are included object or array of includes object.");
        }

    });

    return normalizedQueryParams;
}

/* Допоміжна функція для перетворення одиночних значень в масив перед валідацією. Оскільки req.query
після парсинга масиви з одним елементом перетворює в цей одиночний елемент. Тому його слід перетворити на масив*/
export const arrayPreprocess = (val: string | string[] | undefined): string[] | undefined => {
    if (val === undefined) return undefined;

    const stringArray: string[] =  Array.isArray(val) ? val :  [val];
    return stringArray;
};




