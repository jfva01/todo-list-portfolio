export type NotificationType = "success" | "error" | "info";

// Definimos una estructura reutilizable para los mensajes de notificación en la app
export interface Notification {
  id: number; // Identificador único para cada notificación, para manejar múltiples notificaciones
  message: string;
  type: NotificationType;
  actionLabel?: string;
  onAction?: () => void; // Función opcional para manejar la acción de la notificación, como "Deshacer"
}