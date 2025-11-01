import { useMutation } from "@tanstack/react-query";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { authApi } from "../../apiClients";
import type { RegisterData } from "../types/RegisterData";

const registerUser = async (data: RegisterData) => {
  try {
    const response = await authApi.post("/register", data)
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

const onRegisterSuccess = (navigate: NavigateFunction) => {
  navigate("/home", { replace: true })
};

const onRegisterError = (error: unknown) => {
  console.error("Registration error:", error);
};

export const useRegisterUserMutation = () => {
  const navigate = useNavigate();

  const { mutate, isPending, isSuccess, error, isError } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => onRegisterSuccess(navigate),
    onError: (error) => onRegisterError(error)
  });

  return {
    mutate,
    isPending,
    isSuccess,
    error,
    isError
  };
};