import type {BaseUser} from "../../models/custom/user.model.ts";

export type LoginArgs = {
    email: string;
    password: string;
}

export type RefreshAllTokensArgs = {
    refreshToken: string;
}