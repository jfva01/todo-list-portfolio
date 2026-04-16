import { apiClient } from "../api/apiClient";
import { setToken } from "../auth/tokenService";
import type { LoginResponse } from "../types/Auth";
import { jwtDecode } from "jwt-decode";

// Función para realizar la petición de login, que almacena el token recibido en localStorage
export const loginRequest = async (
  email: string,
  password: string
) => {
  const data = await apiClient<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password
    })
  });

  setToken(data.token);

  return data;
};
// Función para obtener la información del usuario a partir del token almacenado
export const getUserFromToken = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const decoded = jwtDecode<Record<string, any>>(token);
    // Intentamos extraer el email y el nombre de diferentes posibles campos, dependiendo de cómo se haya configurado el backend
    return {
      email:
        decoded.email ||
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],

      name:
        decoded.name ||
        decoded.unique_name ||
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
    };
  } catch {
    return null;
  }
};