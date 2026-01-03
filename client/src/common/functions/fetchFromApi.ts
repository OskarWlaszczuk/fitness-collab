import { api } from "../../apiClients";

export const fetchFromApi = async (endpoint: string) => {
    const response = await api.get(endpoint);
    return response.data;
};