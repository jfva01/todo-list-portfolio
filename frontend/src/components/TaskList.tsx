import { TaskGroup } from "./TaskGroup";
import type { Tarea } from "../types/Tarea";

type GrupoOrdenado = [string, Tarea[]];

type TaskListProps = {
  gruposOrdenados: GrupoOrdenado[];
  getFechaLabel: (fechaKey: string) => string;
  editingId: number | null;
  editTitulo: string;
  editDescripcion: string;
  setEditTitulo: (value: string) => void;
  setEditDescripcion: (value: string) => void;
  handleToggle: (tarea: Tarea) => void;
  handleDelete: (id: number) => void;
  startEdit: (tarea: Tarea) => void;
  cancelEdit: () => void;
  handleSaveEdit: (tarea: Tarea) => void;
  formatFecha: (fecha: string) => string;
  emptyMessage?: string;
};

export const TaskList = ({
  gruposOrdenados,
  getFechaLabel,
  editingId,
  editTitulo,
  editDescripcion,
  setEditTitulo,
  setEditDescripcion,
  handleToggle,
  handleDelete,
  startEdit,
  cancelEdit,
  handleSaveEdit,
  formatFecha,
  emptyMessage = "No hay tareas aún. Agrega la primera tarea usando el formulario de arriba.",
}: TaskListProps) => {
  if (gruposOrdenados.length === 0) {
    return (
      <p className="text-center text-slate-500 mt-6">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      {gruposOrdenados.map(([fechaKey, tareas]) => (
        <TaskGroup
          key={fechaKey}
          fechaLabel={getFechaLabel(fechaKey)}
          tareas={tareas}
          editingId={editingId}
          editTitulo={editTitulo}
          editDescripcion={editDescripcion}
          setEditTitulo={setEditTitulo}
          setEditDescripcion={setEditDescripcion}
          handleToggle={handleToggle}
          handleDelete={handleDelete}
          startEdit={startEdit}
          cancelEdit={cancelEdit}
          handleSaveEdit={handleSaveEdit}
          formatFecha={formatFecha}
        />
      ))}
    </div>
  );
};