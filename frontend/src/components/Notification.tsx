import { CheckCircle, CircleX, X } from "lucide-react";
import type { Notification as NotificationType } from "../types/Notification";

type NotificationProps = {
  notification: NotificationType | null;
  onClose?: () => void;
};

export const Notification = ({ 
  notification, 
  onClose,
 }: NotificationProps) => {
  if (!notification) return null;

  // Muestra una alerta verde si es éxito, o roja si es error
  const isSuccess = notification.type === "success";

  return (
    <div className="fixed top-5 right-5 z-50" aria-live="polite" aria-atomic="true">
      <div
        className={`min-w-70 max-w-sm rounded-lg shadow-lg px-4 py-3 text-sm font-medium flex items-center gap-2 animate-[fadeIn_0.3s_ease-in-out] ${
          isSuccess ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
        }`}
        role="status"
      >
        <div className="mt-0.5">
          {isSuccess ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <CircleX className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 pr-2">
          <p>{notification.message}</p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="shrink-0 opacity-70 hover:opacity-100 transition cursor-pointer"
            aria-label="Cerrar notificación"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <div
          className={`absolute bottom-0 left-0 h-1 animate-toast-progress ${
            isSuccess ? "bg-green-400" : "bg-red-400"
          }`}
        />
      </div>
    </div>
  );
};