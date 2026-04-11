import { useState } from "react";
import { createTarea } from "../api/tareaApi";
import { Plus } from "lucide-react";

type TareaFormProps = {
  onCreated: () => Promise<void>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

export const TareaForm = ({ onCreated, onSuccess, onError }: TareaFormProps) => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim()) return;

    try {
      await createTarea({ titulo, descripcion});
      setTitulo("");
      setDescripcion("");
      onSuccess("Tarea creada correctamente");
      await onCreated(); // refresca lista
    } catch (error) {
      console.error(error);
      onError("No se pudo crear la tarea");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label htmlFor="titulo" className="sr-only">
          Título de la tarea
        </label>
        <input
          id="titulo"
          type="text"
          placeholder="Título de la tarea"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="border border-slate-300 dark:border-slate-600 dark:bg-slate-700 
                    dark:text-white rounded-lg px-4 py-2 outline-none 
                    focus:ring-2 focus:ring-blue-400 w-full"
        />
      </div>
      <div>
        <label htmlFor="descripcion" className="sr-only">
          Descripción de la tarea
        </label>
        <textarea
          id="descripcion"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="border border-slate-300 dark:border-slate-600 
                          dark:bg-slate-700 dark:text-white 
                          rounded-lg px-4 py-2 outline-none 
                          focus:ring-2 focus:ring-blue-400 min-h-22.5 w-full"
        />
      </div>

      <button
        type="submit"
        className="self-end inline-flex items-center justify-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
        title="Agregar tarea"
      >
        <Plus className="w-4 h-4" />
        <span>Agregar</span>
      </button>
    </form>
  );
};

export default TareaForm;