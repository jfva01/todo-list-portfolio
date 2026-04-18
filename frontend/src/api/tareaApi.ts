import type { Tarea } from "../types/Tarea";
import { apiClient } from "./apiClient";

export const getTareas = async (): Promise<Tarea[]> => {
  return apiClient<Tarea[]>("/api/tareas");
};

export const createTarea = async (tarea: { titulo: string; descripcion?: string }) => {
  return apiClient<Tarea>("/api/tareas", {
    method: "POST",
    body: JSON.stringify(tarea),
  });
};

export const updateTarea = async (
  id: number,
  data: Partial<Tarea> // Permite enviar solo los campos que queremos actualizar
) => {
  return apiClient<Tarea>(`/api/tareas/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteTarea = async (id: number) => {
  return apiClient<void>(`/api/tareas/${id}`, {
    method: "DELETE",
  });
};