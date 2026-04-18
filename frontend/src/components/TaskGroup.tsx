import { TaskItem } from "./TaskItem";
import type { Tarea } from "../types/Tarea";

type TaskGroupProps = {
  fechaLabel: string;
  tareas: Tarea[];
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
  highlightedId: number | null;
};

export const TaskGroup = ({
  fechaLabel,
  tareas,
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
  highlightedId
}: TaskGroupProps) => {
  return (
    <section>
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        {fechaLabel}
      </h2>

      <ul className="space-y-3">
        {tareas.map((tarea) => (
          <TaskItem
            key={tarea.id}
            tarea={tarea}
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
            highlightedId={highlightedId}
          />
        ))}
      </ul>
    </section>
  );
};