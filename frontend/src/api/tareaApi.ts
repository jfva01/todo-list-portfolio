import type { Tarea } from "../types/Tarea";

const API_URL = "http://localhost:5021/api/tareas";

export const getTareas = async (): Promise<Tarea[]> => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error al obtener tareas");
  }

  return await response.json();
};

export const createTarea = async (tarea: { titulo: string; descripcion?: string }) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tarea),
  });

  if (!response.ok) {
    throw new Error("Error al crear tarea");
  }

  return await response.json();
};

export const updateTarea = async (tarea: Tarea) => {
  const response = await fetch(`${API_URL}/${tarea.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tarea),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar tarea");
  }
};

export const deleteTarea = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar tarea");
  }
};