import axios from "axios";

const serverUrl = "http://localhost:5000";

export const authApi = axios.create({
    baseURL: `${serverUrl}/api/auth`,
    withCredentials: true,
});

export const userApi = axios.create({
    baseURL: `${serverUrl}/api/user`
});