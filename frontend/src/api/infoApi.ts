import { apiClient } from "./apiClient";

export const getApiVersion = async () => {
    return apiClient<{ version: string }>("/info/version");
};