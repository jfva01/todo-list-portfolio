import { useEffect } from "react";
import { clearTokens } from "../auth/tokenService";

const INACTIVITY_TIME = 15 * 60 * 1000; // 15 minutos de inactividad

export function useInactivityTimeout() {
    // Este hook se encarga de detectar la inactividad del usuario y cerrar sesión automáticamente después de un tiempo determinado
    useEffect(() => {
        let timeout: number;

        const logout = () => {
            clearTokens();
            window.location.href = "/login";
        };
        // Función para resetear el timer de inactividad
        const resetTimer = () => {
            clearTimeout(timeout);
            timeout = window.setTimeout(logout, INACTIVITY_TIME);
        };
        // Eventos que indican actividad del usuario
        const events = ["mousemove", "keydown", "click", "scroll"];
        // Escuchamos los eventos de actividad del usuario para resetear el timer
        events.forEach((event) =>
            window.addEventListener(event, resetTimer)
        );

        // iniciar timer
        resetTimer();

        return () => {
            clearTimeout(timeout);
            events.forEach((event) =>
                window.removeEventListener(event, resetTimer)
            );
        };
    }, []);
}