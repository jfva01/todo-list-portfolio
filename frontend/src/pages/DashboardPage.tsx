import { useTareas } from "../hooks/useTareas";
import { useState } from "react";
import type { Tarea } from "../types/Tarea";
import type { Notification as NotificationModel } from "../types/Notification";
import { Notification } from "../components/Notification";
import { TareaForm } from "../components/TareaForm";
import { TaskList } from "../components/TaskList";
import { Header } from "../components/Header";
import { useInactivityTimeout } from "../hooks/useInactivityTimeout";
import { TodoListSkeleton } from "../components/TodoListSkeleton";
import { useUndoDelete } from "../hooks/useUndoDelete";

export default function DashboardPage() {
    // Hook para manejar el timeout de inactividad y cerrar sesión automáticamente
    useInactivityTimeout();
    const { tareas, loading, error, createOptimistic, toggleOptimistic, editOptimistic, // Estados para manejar tareas, notificaciones, edición, búsqueda y filtrado
        deleteOptimistic, restoreOptimistic, removeFromUI } = useTareas();
    const [notifications, setNotifications] = useState<NotificationModel[]>([]);        // Mejora: Estado para manejar una lista de notificaciones, permitiendo mostrar múltiples notificaciones en la UI
    const [editingId, setEditingId] = useState<number | null>(null);                    // Estados para manejar la edición de tareas
    const [editTitulo, setEditTitulo] = useState("");                                   // Estado para controlar el título en el formulario de edición de tareas
    const [editDescripcion, setEditDescripcion] = useState("");                         // Estado para controlar el filtro de tareas (todas, pendientes o completadas)
    const [searchTerm, setSearchTerm] = useState("");                                   // Estado para manejar el término de búsqueda en el filtro de tareas
    const [filterStatus, setFilterStatus] = useState< "todas" | "pendientes" | "completadas" >("todas");    // Estado para controlar el filtro de tareas (todas, pendientes o completadas)
    const [highlightedId, setHighlightedId] = useState<number | null>(null);            // Estado para resaltar temporalmente una tarea después de crearla o actualizarla
    //const notificationIdRef = useRef(0);

    // Mostrar notificaciones de éxito o error
    const showNotification = ( 
        messageOrConfig: string | Omit<NotificationModel, "id">,
        type?: NotificationModel["type"]
    ) => {
        const id = crypto.randomUUID();

        const notification: NotificationModel =
            typeof messageOrConfig === "string"
                ? { id, message: messageOrConfig, type: type || "info" }
                : { ...messageOrConfig, id };

        setNotifications(prev => [...prev, notification]);

        const duration = notification.duration || 3000;

        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, duration);

        return { id };
    };

    const closeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    // Alternar el estado de completada de una tarea
    const handleToggle = async (tarea: Tarea) => {
        try {
            await toggleOptimistic(tarea);

            showNotification(
                tarea.completada
                    ? "Tarea pendiente"
                    : "Tarea completada",
                    "success"
            );
        } catch (error) {
            console.error(error);
            showNotification("No se pudo actualizar la tarea","error");
        }
    };

    const { deleteWithUndo } = useUndoDelete({
        tareas,
        removeFromUI,
        restoreOptimistic,
        deleteOptimistic,
        showNotification,
        closeNotification,
    });

    // Función para manejar la eliminación de una tarea, que llama a deleteWithUndo para eliminar con opción de deshacer
    const handleDelete = (id: number) => {
        deleteWithUndo(id);
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
    const tareasFiltradas = tareas
        .filter((tarea): tarea is Tarea => tarea != null) // Filtrar tareas nulas o indefinidas
        .filter((tarea) => {
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
        try {
            await editOptimistic(t.id, {
                titulo: editTitulo,
                descripcion: editDescripcion,
            });

            setHighlightedId(t.id);

            setTimeout(() => setHighlightedId(null), 1500);

            showNotification("Tarea actualizada correctamente", "success");
            cancelEdit();
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

    if (error) {
        return <p>Error al cargar tareas</p>;
    }

    return (
        <>
            <div className="min-h-screen bg-slate-100 dark:bg-slate-900 py-10 px-4 transition-colors duration-300">
                <div className="max-w-2xl mx-auto space-y-6">
                    {/* Contenedor para crear nuevas tareas y mostrar notificaciones */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                        <Header />
                        <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
                            {notifications.map(n => (
                                <Notification
                                    key={n.id}
                                    notification={n}
                                    onClose={() =>
                                        setNotifications(prev =>
                                            prev.filter(x => x.id !== n.id)
                                        )
                                    }
                                />
                            ))}
                        </div>

                        <TareaForm
                            onCreated={createOptimistic}
                            onSuccess={(message) => showNotification(message, "success")}
                            onError={(message) => showNotification(message, "error")}
                        />
                    </div>
                </div>
                {/* Contenedor para búsqueda, filtros y lista de tareas */}
                <div className="mt-6 max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 flex flex-col gap-3">
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
                            className="w-full border border-slate-300 dark:border-slate-600 
                                dark:bg-slate-700 dark:text-white 
                                rounded-lg px-4 py-2 outline-none 
                                focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setFilterStatus("todas")}
                            className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition ${
                            filterStatus === "todas"
                                ? "bg-slate-800 text-white dark:bg-slate-600"
                                : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
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
                {/* Contenedor para la lista de tareas agrupadas por fecha */}
                <div className="mt-6 max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                    {loading && !tareas.length ? (
                        <TodoListSkeleton />
                    ) : (
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
                            highlightedId={highlightedId}
                        />
                    )}
                </div>
            </div>
            {/* <ConfirmModal
                isOpen={isModalOpen}
                message="¿Seguro deseas eliminar esta tarea?"
                onConfirm={confirmDelete}
                onCancel={() => setIsModalOpen(false)}
            /> */}
        </>
    );
}

