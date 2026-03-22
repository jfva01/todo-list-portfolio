import { useEffect, useState } from "react";
import { getTareas } from "../api/tareaApi";
import type { Tarea } from "../types/Tarea";

export const useTareas = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchTareas();
  }, []);

  return { tareas, loading, fetchTareas };
};