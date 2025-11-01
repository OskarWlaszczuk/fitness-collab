import { useLayoutEffect } from "react";
import { userApi } from "../../apiClients";
import { useAccessTokenQuery } from "../../common/hooks/useAccessTokenQuery";
import { useNavigate } from "react-router-dom";

export const useUserApiInterceptors = () => {
    const navigate = useNavigate();
  const { accessToken, refetchAccessToken } = useAccessTokenQuery();

  useLayoutEffect(() => {
    userApi.interceptors.request.use((config) => {
      if (accessToken) {
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
          navigate("/login", { replace: true });
          console.log(error);
        }
      }
    );
  }, [accessToken, refetchAccessToken, navigate]);
};