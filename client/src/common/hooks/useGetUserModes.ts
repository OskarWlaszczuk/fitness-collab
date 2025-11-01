import axios from "axios";
import type { UserMode } from "../types/UserMode";
import { useQuery } from "@tanstack/react-query";

interface ModesResponse {
    modes: UserMode[];
}

const fetchModes = async () => {
    const response = await axios.get<ModesResponse>("http://localhost:5000/api/modes");
    return response.data.modes;
};

export const useGetUserModes = () => {
    const {
        status: modesStatus,
        data: modes,
        isPaused: isModesPaused
    } = useQuery<UserMode[]>({
        queryKey: ["modes"],
        queryFn: fetchModes,
    });

    return { modesStatus, isModesPaused, modes };
};