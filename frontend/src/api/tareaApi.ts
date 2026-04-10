import type { Tarea } from "../types/Tarea";
import { apiClient } from "./apiClient";

export const getTareas = async (): Promise<Tarea[]> => {
  return apiClient<Tarea[]>("/tareas");
};

export const createTarea = async (tarea: { titulo: string; descripcion?: string }) => {
  return apiClient<Tarea>("/tareas", {
    method: "POST",
    body: JSON.stringify(tarea),
  });
};

export const updateTarea = async (tarea: Tarea) => {
  return apiClient<void>(`/tareas/${tarea.id}`, {
    method: "PUT",
    body: JSON.stringify(tarea),
  });
};

export const deleteTarea = async (id: number) => {
  return apiClient<void>(`/tareas/${id}`, {
    method: "DELETE",
  });
};