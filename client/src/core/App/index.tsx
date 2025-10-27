import { Navigate, Route, Routes } from "react-router-dom"
import { Home } from "../../features/home";
import { Layout } from "./Layout";
import { Register } from "./Register";
import { useAccessTokenQuery } from "../../common/hooks/useAccessTokenQuery";
import { Login } from "./Login";

export const App = () => {
  const { accessToken } = useAccessTokenQuery();
  console.log(accessToken);
  const baseUrl = "/fitness-collab";
  const baseAuthUrl = `${baseUrl}/auth`;

  const getRouteUrl = (route: string) => `${baseUrl}/${route}`;
  const getAuthRouteUrl = (authRoute: string) => `${baseAuthUrl}/${authRoute}`;

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path={getRouteUrl("home")} element={<Home />} />
        <Route path="*" element={<Navigate to={getRouteUrl("home")} replace />} />
      </Route>
      <Route path={getAuthRouteUrl("login")} element={<Login />} />
      <Route path={getAuthRouteUrl("register")} element={<Register />} />
      <Route path={`${baseAuthUrl}/*`} element={<Navigate to={getAuthRouteUrl("login")} replace />} />
    </Routes>
  );
};