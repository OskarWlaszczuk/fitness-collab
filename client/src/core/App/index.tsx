import { Navigate, Route, Routes } from "react-router-dom"
import { Home } from "../../features/home";
import { Layout } from "./Layout";
import { Register } from "./Register";
import { useAccessTokenQuery } from "../../common/hooks/useAccessTokenQuery";
import { Login } from "./Login";
import { useLayoutEffect } from "react";
import { userApi } from "../../apiClients";

export const App = () => {
  const { accessToken, refetchAccessToken } = useAccessTokenQuery();

  useLayoutEffect(() => {
    userApi.interceptors.request.use((config) => {
      if (accessToken) {
        console.log("Adding access token to user api request", accessToken);
        
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    });

    userApi.interceptors.response.use(
      response => response,
      async (error) => {
        try {
          const originalRequest = error.config;

          if (
            (error.status === 403 || error.status === 401) && !originalRequest._retry
          ) {
            originalRequest._retry = true;
            await refetchAccessToken();
          }
          //po co odrzucenie obietnicy tutaj?
          return Promise.reject(error);
        } catch (error) {
          console.log(error);
        }
      }
    );
  }, [accessToken, refetchAccessToken]);

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
      {
        // jeżeli jest route /auth to nie pobiera access tokenu!
      }
      <Route path={getAuthRouteUrl("login")} element={<Login />} />
      <Route path={getAuthRouteUrl("register")} element={<Register />} />
      <Route path={`${baseAuthUrl}/*`} element={<Navigate to={getAuthRouteUrl("login")} replace />} />
    </Routes>
  );
};