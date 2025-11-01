import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../apiClients";
import type { RegisterData } from "../types/RegisterData";
import type { LoginResponse } from "../types/LoginResponse";

const registerUser = async (data: RegisterData) => {
  const response = await authApi.post<LoginResponse>("/register", data)
  return response.data;
};

export const useRegisterUserMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess, error, isError } = useMutation({
    mutationFn: registerUser,
    onSuccess: ({ accessToken, mode }) => {
      queryClient.setQueryData(["accessToken"], accessToken);
      queryClient.setQueryData(["userActiveMode"], mode);

      navigate("/home", { replace: true });
    },
  });

  return {
    mutate,
    isPending,
    isSuccess,
    error,
    isError
  };
};