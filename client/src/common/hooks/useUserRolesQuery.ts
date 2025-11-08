import axios from "axios";
import type { UserRole } from "../types/UserRole";
import { useQuery } from "@tanstack/react-query";

interface UserRolesResponse {
    roles: UserRole[];
}

const fetchRoles = async () => {
    const response = await axios.get<UserRolesResponse>("http://localhost:5000/api/roles");
    return response.data.roles;
};

export const useUserRolesQuery = () => {
    const {
        status: rolesStatus,
        data: roles,
        isPaused: isRolesPaused
    } = useQuery<UserRole[]>({
        //czy dodać tu id użytkownika?
        queryKey: ["user", "roles"],
        queryFn: fetchRoles,
    });

    return { rolesStatus, isRolesPaused, roles };
};