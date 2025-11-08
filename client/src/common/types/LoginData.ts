import type { UserRole } from "./UserRole";

export interface LoginData {
    email: string;
    password: string;
    roleId: UserRole["id"];
}