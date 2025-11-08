import { Navigate, Outlet } from "react-router-dom";
import { useUserActiveRoleQuery } from "../../../common/hooks/useUserActiveRoleQuery";
import type { UserRole } from "../../../common/types/UserRole";

interface Props {
    allowedRoles: UserRole["id"][];
}

export const RoleProtectedRoute = ({ allowedRoles }: Props) => {
    const { activeRole, status } = useUserActiveRoleQuery();

    if (status === "pending") return <p>Loading...</p>;

    if (!activeRole || !allowedRoles.includes(activeRole.id)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};