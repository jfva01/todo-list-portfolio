import { Pencil, Save, Trash2, X } from "lucide-react";
import { IconButton } from "./IconButton";
import type { Tarea } from "../types/Tarea";
import { useEffect, useState } from "react";

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
  highlightedId: number | null;
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
  highlightedId
}: TaskItemProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const isEditing = editingId === tarea.id;

  return (
    <li data-testid="todo-item"
        className={`
          flex items-start justify-between gap-4
          border rounded-xl p-4
          transition-all duration-300 ease-out transform
          bg-slate-50 border-slate-200

          ${visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2"}

          ${tarea.optimistic ? "opacity-60 pointer-events-none" : ""}

          ${highlightedId === tarea.id && "animate-pulse"
            ? "ring-2 ring-blue-400 bg-blue-50 scale-[1.01]"
            : ""
          }
        `}
    >
      <div className="flex items-start gap-3 flex-1">
        <input
          type="checkbox"
          checked={tarea.completada}
          onChange={() => handleToggle(tarea)}
          className="h-5 w-5 cursor-pointer mt-1 transition-transform duration-150 active:scale-90"
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
                className={`
                  text-base font-medium transition-all duration-300
                  ${tarea.completada
                    ? "line-through text-slate-400 scale-[0.98]"
                    : "text-slate-700 scale-100"}
                `}
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
              className="cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white transition-all duration-200 active:scale-95 hover:scale-[1.02]"
            >
              <Save className="w-4 h-4" />
            </IconButton>

            <IconButton
              onClick={cancelEdit}
              title="Cancelar edición"
              ariaLabel="Cancelar edición"
              className="cursor-pointer bg-slate-400 hover:bg-slate-500 text-white transition-all duration-200 active:scale-95 hover:scale-[1.02]"
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
  console.log("highlightedId en TaskItem:", highlightedId);
};