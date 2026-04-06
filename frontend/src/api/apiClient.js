const API_BASE_URL = "https://localhost:5021/api/Tareas/"; // backend

export const apiClient = async (endpoint, options = {}) => {

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  };
  // Request agrega el JWT automáticamente.
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw {
      status: response.status,
      message: error.message || "Error en la petición"
    };
  }

  return response.json();
};