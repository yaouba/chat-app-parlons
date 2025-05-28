import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const apiCall = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});