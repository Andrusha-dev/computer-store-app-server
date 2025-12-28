/* Допоміжна функція для перетворення одиночних значень в масив перед валідацією. Оскільки req.query
після парсинга масиви з одним елементом перетворює в цей одиночний елемент. Тому його слід перетворити на масив*/
export const arrayPreprocess = (val: unknown) => {
    if (val === undefined) return undefined;
    if (Array.isArray(val)) return val;
    return [val];
};