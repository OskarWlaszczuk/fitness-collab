import { Navigate, Outlet } from "react-router-dom";
import { useUserActiveModeQuery } from "../../../common/hooks/useUserActiveModeQuery";
import type { UserMode } from "../../../common/types/UserMode";

interface Props {
    allowedModes: UserMode["id"][];
}

export const ModeProtectedRoute = ({ allowedModes }: Props) => {
    const { activeMode, status } = useUserActiveModeQuery();

    if (status === "pending") return <p>Loading...</p>;

    if (!activeMode || !allowedModes.includes(activeMode.id)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};