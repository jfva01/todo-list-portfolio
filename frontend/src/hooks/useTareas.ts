import { useEffect, useState } from "react";
import { createTarea, updateTarea, deleteTarea, getTareas } from "../api/tareaApi";
import type { Tarea } from "../types/Tarea";

export const useTareas = () => { // Custom hook para manejar la lógica de tareas
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Función para cargar las tareas desde la API
  const fetchTareas = async () => {
    try {
      setLoading(true);

      const data = await getTareas();

      setTareas(data);

    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  // Al montar el componente, se cargan las tareas desde la API
  useEffect(() => {
    fetchTareas();
  }, []);

  // Función para crear una tarea con actualización optimista, es decir, actualizamos la UI antes de recibir la respuesta de la API
  const createOptimistic = async (data: { titulo: string; descripcion?: string }) => {
    // 1. Creamos la tarea temporal
    const tempId = Date.now();

    const tareaOptimista = {
      id: tempId,
      titulo: data.titulo,
      descripcion: data.descripcion,
      completada: false,
      fechaCreacion: new Date().toISOString(),
      optimistic: true,
    };

    // 2. Hacemos Backup (para rollback en caso de error)
    const previousTareas = tareas;

    // 3. Insertamos inmediatamente
    setTareas(prev => [tareaOptimista, ...prev]);

    try {
      // 4. Llamamos a la API para crear la tarea real
      const tareaReal = await createTarea(data);

      // 5. Reemplazar la tarea "temporal" por la real
      setTareas(prev =>
        prev.map(t => (t.id === tempId ? tareaReal : t ))
      );

      return tareaReal;

    } catch (error) {
      // 6. Rollback si falla
      setTareas(previousTareas);
      throw error;
    }
  };
  
  // Función para actualizar el estado de una tarea (completada/no completada) con actualización optimista
  const toggleOptimistic = async (tarea: Tarea) => {
    const previousTareas = tareas;

    // 1. Actualizar UI inmediatamente
    setTareas(prev =>
      prev.map(t =>
        t.id === tarea.id
          ? { ...t, completada: !t.completada }
          : t
      )
    );

    try {
      // 2. Llamar API real
      await updateTarea(tarea.id, { completada: !tarea.completada, });
    } catch (error) {
      // 3. Rollback si falla
      setTareas(previousTareas);
      throw error;
    }
  };

  // Función para editar una tarea con actualización optimista, es decir, actualizamos la UI antes de recibir la respuesta de la API
  const editOptimistic = async (
    id: number,
    data: { titulo: string; descripcion?: string }
  ) => {
    // 1. Guardar estado previo (para rollback)
    const previousTareas = tareas;

    // 2. Actualizar UI inmediatamente
    setTareas(prev =>
      prev.map(t =>
        t.id === id
          ? { 
              ...t, 
              ...data,
              optimistic: true,
            }
          : t
      )
    );

    try {
      // 3. Llamar API real
      const updated = await updateTarea(id, data);

      // 4. Reconciliar con lo que devuelve backend
      setTareas(prev =>
        prev.map(t =>
          t.id === id
            ? (updated ?? { ...t, ...data, optimistic: false })
            : t
        )
      );

      return updated;
    } catch (error) {
      // 5. Rollback si falla
      setTareas(previousTareas);
      throw error;
    }
  };

  // Función para eliminar una tarea con actualización optimista, es decir, actualizamos la UI antes de recibir la respuesta de la API
  const deleteOptimistic = async (id: number) => {
    // 1. Guardar estado previo (para rollback)
    const previousTareas = tareas;

    // 2. Actualizar UI inmediatamente
    setTareas(prev => prev.filter(t => t.id !== id));

    try {
      // 3. Llamar API real
      await deleteTarea(id);
    } catch (error) {
      // 4. Rollback si falla
      setTareas(previousTareas);
      throw error;
    }
  };

  return { 
    tareas,
    loading,
    error,
    refetch: fetchTareas,
    createOptimistic,
    toggleOptimistic,
    editOptimistic,
    deleteOptimistic,
   };
};