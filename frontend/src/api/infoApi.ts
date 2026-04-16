import { apiClient } from "./apiClient";

export const getApiVersion = async () => {
    return apiClient<{ version: string }>("/api/info/version");
};