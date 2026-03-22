export type NotificationType = "success" | "error";

// Definimos una estructura reutilizable para los mensajes de notificación en la app
export interface Notification {
  message: string;
  type: NotificationType;
}