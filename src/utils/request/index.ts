import {type QueryParams} from "../../types/common/request.types.ts";


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