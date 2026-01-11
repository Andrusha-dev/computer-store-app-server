/* Допоміжна функція для перетворення одиночних значень в масив перед валідацією. Оскільки req.query
після парсинга масиви з одним елементом перетворює в цей одиночний елемент. Тому його слід перетворити на масив*/
export const arrayPreprocess = (val: string | string[] | undefined): string[] | undefined => {
    if (val === undefined) return undefined;

    const stringArray: string[] =  Array.isArray(val) ? val :  [val];
    return stringArray;
};