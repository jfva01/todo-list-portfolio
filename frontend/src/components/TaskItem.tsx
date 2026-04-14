import { Pencil, Save, Trash2, X } from "lucide-react";
import { IconButton } from "./IconButton";
import type { Tarea } from "../types/Tarea";

type TaskItemProps = {
  tarea: Tarea;
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
};

export const TaskItem = ({
  tarea,
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
}: TaskItemProps) => {
  const isEditing = editingId === tarea.id;

  return (
    <li data-testid="todo-item" className="flex items-start justify-between gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
      <div className="flex items-start gap-3 flex-1">
        <input
          type="checkbox"
          checked={tarea.completada}
          onChange={() => handleToggle(tarea)}
          className="h-5 w-5 cursor-pointer mt-1"
          disabled={isEditing}
          aria-label={`Marcar tarea ${tarea.titulo} como ${
            tarea.completada ? "pendiente" : "completada"
          }`}
        />

        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label htmlFor={`edit-titulo-${tarea.id}`} className="sr-only">
                  Editar título de la tarea
                </label>
                <input
                  id={`edit-titulo-${tarea.id}`}
                  type="text"
                  value={editTitulo}
                  onChange={(e) => setEditTitulo(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Título"
                />
              </div>

              <div>
                <label htmlFor={`edit-descripcion-${tarea.id}`} className="sr-only">
                  Editar descripción de la tarea
                </label>
                <textarea
                  id={`edit-descripcion-${tarea.id}`}
                  value={editDescripcion}
                  onChange={(e) => setEditDescripcion(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 min-h-22.5"
                  placeholder="Descripción"
                />
              </div>

            <p className="text-xs text-slate-400">
              Creada: {formatFecha(tarea.fechaCreacion)}
            </p>
          </div>
          ) : (
            <div>
              <p
                className={`text-base font-medium ${
                  tarea.completada
                    ? "line-through text-slate-400"
                    : "text-slate-700"
                }`}
              >
                {tarea.titulo}
              </p>

              {tarea.descripcion && tarea.descripcion.trim() !== "" && (
                <p className="text-sm text-slate-500 mt-1">
                  {tarea.descripcion}
                </p>
              )}

              <p className="text-xs text-slate-400 mt-2">
                Creada: {formatFecha(tarea.fechaCreacion)}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <IconButton
              onClick={() => handleSaveEdit(tarea)}
              title="Guardar cambios"
              ariaLabel="Guardar cambios"
              className="cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Save className="w-4 h-4" />
            </IconButton>

            <IconButton
              onClick={cancelEdit}
              title="Cancelar edición"
              ariaLabel="Cancelar edición"
              className="cursor-pointer bg-slate-400 hover:bg-slate-500 text-white"
            >
              <X className="w-4 h-4" />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton
              onClick={() => startEdit(tarea)}
              title="Editar tarea"
              ariaLabel="Editar tarea"
              className="cursor-pointer bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Pencil className="w-4 h-4" />
            </IconButton>

            <IconButton
              onClick={() => handleDelete(tarea.id)}
              data-testid="delete-todo-button"
              title="Eliminar tarea"
              ariaLabel="Eliminar tarea"
              className="cursor-pointer bg-red-500 hover:bg-red-600 text-white"
            >
              <Trash2 className="w-4 h-4" />
            </IconButton>
          </>
        )}
      </div>
    </li>
  );
};