import { useLayoutEffect } from "react";
import { api } from "../../apiClients";
import { useAccessTokenQuery } from "../../common/hooks/useAccessTokenQuery";
import { useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "../../common/hooks/useLogoutUserMutation";

export const useUserApiInterceptors = () => {
  const navigate = useNavigate();
  const { accessToken, refetchAccessToken } = useAccessTokenQuery();
  const { logout } = useLogoutUserMutation();

  useLayoutEffect(() => {
    api.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    });

    api.interceptors.response.use(
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
          logout();
          navigate("/login", { replace: true });
          console.log(error);
        }
      }
    );
  }, [accessToken, refetchAccessToken, navigate, logout]);
};