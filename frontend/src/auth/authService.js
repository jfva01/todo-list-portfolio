import { apiClient } from "../api/apiClient";

export const loginRequest = async (email, password) => {
  return apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password
    })
  });
};