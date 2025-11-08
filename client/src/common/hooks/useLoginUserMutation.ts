import { useNavigate } from "react-router-dom";
import { authApi } from "../../apiClients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LoginData } from "../types/LoginData";
import type { LoginResponse } from "../types/LoginResponse";

const loginUser = async (data: LoginData) => {
    try {
        const response = await authApi.post<LoginResponse>("/login", data);
        return response.data;
    } catch (error) {
        console.error("Login request error:", error);
        throw error;
    }
};

export const useLoginUserMutation = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate, isPending, isSuccess, error, isError } = useMutation({
        mutationFn: loginUser,
        onSuccess: ({ accessToken, role }) => {
            queryClient.setQueryData(["accessToken"], accessToken);
            queryClient.setQueryData(["user", "activeRole"], role);

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