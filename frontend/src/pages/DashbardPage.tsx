import { useTareas } from "../hooks/useTareas";
import { useState } from "react";
import type { Tarea } from "../types/Tarea";
import type { Notification as NotificationType } from "../types/Notification";
import { TareaForm } from "../components/TareaForm";
import { Notification } from "../components/Notification";
import { TaskList } from "../components/TaskList";
import { updateTarea } from "../api/tareaApi";
import { deleteTarea } from "../api/tareaApi";
import { Header } from "../components/Header";
import { useInactivityTimeout } from "../hooks/useInactivityTimeout";

export default function DashboardPage() {
    useInactivityTimeout();

    const { tareas, loading, fetchTareas } = useTareas();
    const [notification, setNotification] = useState<NotificationType | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitulo, setEditTitulo] = useState("");
    const [editDescripcion, setEditDescripcion] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState< "todas" | "pendientes" | "completadas" >("todas");

    // Eliminar una tarea
    const handleDelete = async (id: number) => {
        const confirmacion = window.confirm(
            "¿Seguro quieres eliminar esta tarea?"
        );

        if (!confirmacion) return;

        try {
            await deleteTarea(id);
            showNotification("Tarea eliminada correctamente", "success");
            await fetchTareas();
        } catch (error) {
            console.error(error);
            showNotification("No se pudo eliminar la tarea", "error");
        }
    };

    // Alternar el estado de completada de una tarea
    const handleToggle = async (t: Tarea) => {
        try {
            await updateTarea({
                // Solo se actualiza el campo de completada, pero se envían los demás campos para evitar problemas de validación en el backend
                ...t,
                completada: !t.completada,
            });
            await fetchTareas();
            showNotification("Tarea actualizada correctamente", "success");
        } catch (error) {
            console.error(error);
            showNotification("No se pudo actualizar la tarea", "error");
            }
    };

    // Mostrar notificaciones de éxito o error
    const showNotification = (
        message: string, 
        type: NotificationType["type"]
    ) => {
        setNotification({ message, type });
        setTimeout(() => {
        setNotification(null);
        }, 3000);
    };

    // Mostrar un mensaje de carga mientras se obtienen las tareas
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <p className="text-lg font-medium text-slate-600">Cargando tareas...</p>
            </div>
        );
    }

    // Crear lista filtrada antes de agrupar
    const tareasFiltradas = tareas.filter((tarea) => {
        const texto = `${tarea.titulo} ${tarea.descripcion ?? ""}`.toLowerCase();
        const coincideBusqueda = texto.includes(searchTerm.toLowerCase());

        const coincideEstado =
        filterStatus === "todas"
            ? true
            : filterStatus === "completadas"
            ? tarea.completada
            : !tarea.completada;

        return coincideBusqueda && coincideEstado;
    });

    // Ordenar las tareas por fecha de creación (más recientes primero)
    const tareasOrdenadas = [...tareasFiltradas].sort(
        (a, b) =>
        new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
    );

    // Agrupar las tareas por fecha de creación (solo año-mes-día) para mostrar un encabezado de fecha en la UI
    const tareasAgrupadas = tareasOrdenadas.reduce<Record<string, Tarea[]>>(
        (acc, tarea) => {
            const fechaKey = getFechaKey(tarea.fechaCreacion);

            if (!acc[fechaKey]) {
                acc[fechaKey] = [];
            }

            acc[fechaKey].push(tarea);
            return acc;
        },
        {}
    );

    // Ordenar los grupos de tareas por fecha (más recientes primero)
    const gruposOrdenados = Object.entries(tareasAgrupadas).sort(
        ([fechaA], [fechaB]) => new Date(fechaB).getTime() - new Date(fechaA).getTime()
    );

    // Iniciar edición de una tarea
    const startEdit = (t: Tarea) => {
        setEditingId(t.id);
        setEditTitulo(t.titulo);
        setEditDescripcion(t.descripcion ?? "");
    };

    // Cancelar edición
    const cancelEdit = () => {
        setEditingId(null);
        setEditTitulo("");
        setEditDescripcion("");
    };

    // Guardar cambios de edición
    const handleSaveEdit = async (t: Tarea) => {
        if (!editTitulo.trim()) {
            showNotification("El título no puede estar vacío", "error");
            return;
        }

        try {
            await updateTarea({
                ...t,
                titulo: editTitulo.trim(),
                descripcion: editDescripcion.trim(),
            });

            showNotification("Tarea actualizada correctamente", "success");
            cancelEdit();
            await fetchTareas();
        } catch (error) {
            console.error(error);
            showNotification("No se pudo actualizar la tarea", "error");
        }
    };

    // Formatear fechas de manera legible
    const formatFecha = (fecha: string) => {
        return new Date(fecha).toLocaleString("es-CL", {
        dateStyle: "medium",
        timeStyle: "short",
        });
    };

    // Obtener una clave única para cada fecha (solo año-mes-día) para agrupar tareas por fecha
    function getFechaKey(fecha: string) {
        const d = new Date(fecha);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    // Obtener una etiqueta legible para cada fecha (Hoy, Ayer o fecha formateada) para mostrar en la UI
    function getFechaLabel(fechaKey: string) {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const todayKey = getFechaKey(today.toISOString());
        const yesterdayKey = getFechaKey(yesterday.toISOString());

        if (fechaKey === todayKey) return "Hoy";
        if (fechaKey === yesterdayKey) return "Ayer";

        const [year, month, day] = fechaKey.split("-");
        const fecha = new Date(Number(year), Number(month) - 1, Number(day));

        return fecha.toLocaleDateString("es-CL", {
        day: "numeric",
        month: "short",
        year: "numeric",
        });
    };

    const emptyMessage =
    tareas.length === 0
        ? "No hay tareas aún. Agrega la primera tarea usando el formulario de arriba."
        : "No se encontraron tareas con los filtros actuales.";

    return (
        <div className="min-h-screen bg-slate-100 py-10 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6">
                <Header />

                <Notification
                    notification={notification}
                    onClose={() => setNotification(null)}
                />

                <TareaForm
                    onCreated={fetchTareas}
                    onSuccess={(message) => showNotification(message, "success")}
                    onError={(message) => showNotification(message, "error")}
                />
            </div>
            <div className="mt-6 max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-3">
                <div>
                    <label htmlFor="buscar-tareas" className="sr-only">
                        Buscar tareas
                    </label>
                    <input
                        id="buscar-tareas"
                        type="text"
                        placeholder="Buscar por título o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setFilterStatus("todas")}
                        className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition ${
                        filterStatus === "todas"
                            ? "bg-slate-800 text-white"
                            : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        }`}
                    >
                        Todas
                    </button>

                    <button
                        type="button"
                        onClick={() => setFilterStatus("pendientes")}
                        className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition ${
                        filterStatus === "pendientes"
                            ? "bg-amber-500 text-white"
                            : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        }`}
                    >
                        Pendientes
                    </button>

                    <button
                        type="button"
                        onClick={() => setFilterStatus("completadas")}
                        className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition ${
                        filterStatus === "completadas"
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        }`}
                    >
                        Completadas
                    </button>
                </div>
                <p className="text-sm text-slate-500">
                    Mostrando {tareasFiltradas.length} de {tareas.length} tareas
                </p>
            </div>
            <div className="mt-6 max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6">
                <TaskList
                    gruposOrdenados={gruposOrdenados}
                    getFechaLabel={getFechaLabel}
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
                    emptyMessage={emptyMessage}
                />
            </div>
        </div>
    );
}

