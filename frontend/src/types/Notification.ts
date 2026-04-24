export type NotificationType = "success" | "error" | "info";

// Definimos una estructura reutilizable para los mensajes de notificación en la app
export interface Notification {
  id: string; // Identificador único para cada notificación, para manejar múltiples notificaciones
  message: string;
  type: NotificationType;
  duration?: number; // Duración opcional para mostrar la notificación, por defecto 3000ms
  actionLabel?: string;
  onAction?: () => void; // Función opcional para manejar la acción de la notificación, como "Deshacer"
}