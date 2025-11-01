import type { UserMode } from "./UserMode";

export interface LoginData {
    email: string;
    password: string;
    modeId: UserMode["id"];
}