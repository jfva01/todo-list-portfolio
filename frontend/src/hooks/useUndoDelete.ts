import type { Tarea } from "../types/Tarea";
import type { Notification } from "../types/Notification";

type UseUndoDeleteProps = {
    tareas: Tarea[];
    removeFromUI: (id: number) => void;
    restoreOptimistic: (item: Tarea, index: number) => void;
    deleteOptimistic: (id: number) => Promise<void>;
    showNotification: (
        config: Omit<Notification, "id">
    ) => { id: string };
    closeNotification: (id: string) => void;
};

export const useUndoDelete = ({
    tareas,
    removeFromUI,
    restoreOptimistic,
    deleteOptimistic,
    showNotification,
    closeNotification
}: UseUndoDeleteProps) => {

    const deleteWithUndo = (id: number) => {
        const index = tareas.findIndex(t => t.id === id);
        if (index === -1) return;

        const item = tareas[index];
        if (!item) return;

        // 1. Remover tarea de UI
        removeFromUI(id);

        // 2. Timer para delete real
        const timeoutId = setTimeout(async () => {
            try {
                await deleteOptimistic(id);
            } catch (error) {
                console.error(error);
            }
        }, 3000);

        // 4. Notificación + undo
        const { id: notificationId } = showNotification({
            message: `Tarea "${item.titulo}" eliminada`,
            type: "info",
            actionLabel: "Deshacer",
            onAction: () => {
                // Cancelar delete real
                clearTimeout(timeoutId);
                restoreOptimistic(item, index);
                closeNotification(notificationId);
            }
        });
    };

    return { deleteWithUndo };
};