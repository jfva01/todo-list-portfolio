import { useEffect, useState } from "react";
import { getTareas } from "../api/tareaApi";
import type { Tarea } from "../types/Tarea";
// Custom hook para manejar la lógica de tareas
export const useTareas = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  // Función para cargar las tareas desde la API
  const fetchTareas = async () => {
    try {
      const data = await getTareas();
      setTareas(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // Al montar el componente, se cargan las tareas desde la API
  useEffect(() => {
    fetchTareas();
  }, []);

  return { tareas, loading, fetchTareas };
};