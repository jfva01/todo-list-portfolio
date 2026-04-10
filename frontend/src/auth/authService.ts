import { apiClient } from "../api/apiClient";
import { setToken } from "../auth/tokenService";
import type { LoginResponse } from "../types/Auth";

export const loginRequest = async (
  email: string,
  password: string
) => {
  const data = await apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password
    })
  });

  setToken(data.token);

  return data;
};