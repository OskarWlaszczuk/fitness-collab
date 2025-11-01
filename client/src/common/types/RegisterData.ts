import type { LoginData } from "./LoginData";

export interface RegisterData extends LoginData {
    name: string;
    surname: string;
    nickname: string;
}