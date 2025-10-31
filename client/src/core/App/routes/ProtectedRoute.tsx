import { Navigate, Outlet } from "react-router-dom";
import { useAccessTokenQuery } from "../../../common/hooks/useAccessTokenQuery";

export const ProtectedRoute = () => {
  const { accessToken, status } = useAccessTokenQuery();

  if (status === "pending") return <p>Loading...</p>;

  // brak tokenu = nieautoryzowany
  if (!accessToken) return <Navigate to="/login" replace />;

  return <Outlet />;
};