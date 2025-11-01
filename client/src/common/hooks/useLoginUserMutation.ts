import { useNavigate, type NavigateFunction } from "react-router-dom";
import { authApi } from "../../apiClients";
import { useMutation } from "@tanstack/react-query";
import type { LoginData } from "../types/LoginData";

const loginUser = async (data: LoginData) => {
    try {
        const response = await authApi.post("/login", data);
        return response.data.data;
    } catch (error) {
        console.error("Login request error:", error);
        throw error;
    }
};

const onLoginSuccess = (navigate: NavigateFunction) => {
    navigate("/home", { replace: true });
};

const onLoginError = (error: unknown) => {
    console.error("Login error:", error);
};

export const useLoginUserMutation = () => {
    const navigate = useNavigate();

    const { mutate, isPending, isSuccess, error, isError } = useMutation({
        mutationFn: loginUser,
        onSuccess: () => onLoginSuccess(navigate),
        onError: (error) => onLoginError(error)
    });

    return {
        mutate,
        isPending,
        isSuccess,
        error,
        isError
    };
};