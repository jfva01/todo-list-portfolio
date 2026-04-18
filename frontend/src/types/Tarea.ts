export interface Tarea {
  id: number;
  titulo: string;
  descripcion?: string;
  completada: boolean;
  fechaCreacion: string;
  optimistic?: boolean; // Solo para tareas temporales
}