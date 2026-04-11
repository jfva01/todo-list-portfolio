interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title = "Confirmar acción",
  message,
  onConfirm, // Función que se ejecuta al confirmar
  onCancel, // Función que se ejecuta al cancelar
}: ConfirmModalProps) {
    // Si el modal no está abierto, no renderizamos nada
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md sm:max-w-lg shadow-lg transition-all scale-100">

                <h2 className="text-lg font-semibold mb-4 text-slate-800">
                    {title}
                </h2>

                <p className="text-slate-600 mb-6">
                    {message}
                </p>

                <div className="flex justify-end gap-3">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300"
                >
                    Cancelar
                </button>

                <button
                    onClick={onConfirm}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                    Confirmar
                </button>
                </div>
            </div>
        </div>
    );
}