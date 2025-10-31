import { Navigate, Outlet } from "react-router-dom";
import { useAccessTokenQuery } from "../../../common/hooks/useAccessTokenQuery";

export const AuthRoute = () => {
  const { accessToken, status } = useAccessTokenQuery();

  if (status === "pending") return <p>Loading...</p>;

  // jeśli user już zalogowany, przekieruj np. do home
  if (accessToken) return <Navigate to="/home" replace />;

  return <Outlet />;
};