import { getToken, clearTokens } from "../auth/tokenService";

const API_BASE_URL = import.meta.env.VITE_API_URL; // backend

interface ApiError {
  status: number;
  message: string;
}
// Función genérica para hacer peticiones a la API, incluyendo el token de autenticación si está presente
export async function apiClient<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    // Obtenemos el token de autenticación
    const token = getToken();
    // Configuramos los headers, incluyendo el token si existe
    const config: RequestInit = {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    };
    // Si hay un token, lo añadimos al header Authorization
    if (token) {
        (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    // Hacemos la petición a la API
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    // Si la respuesta es 401, significa que el token no es válido o ha expirado, por lo que limpiamos los tokens y redirigimos al login
    if (response.status === 401) {
        clearTokens();
        window.location.href = "/login";
        throw new Error("Sesión expirada");
    }
    // Si la respuesta no es exitosa, intentamos obtener el mensaje de error del cuerpo de la respuesta
    if (!response.ok) {
        const errorBody = await response.json().catch(() => null);

        const error: ApiError = {
            status: response.status,
            message: errorBody?.message ?? "Error en la petición"
        };

        throw error;
    }

    // Si no hay contenido (204 No Content)
    if (response.status === 204) {
        return null as unknown as T;
    }

    // Intentar parsear JSON solo si existe
    const text = await response.text();
    return text ? JSON.parse(text) : (null as unknown as T);
};