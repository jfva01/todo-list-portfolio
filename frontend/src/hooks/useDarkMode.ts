import { useEffect, useState } from "react";
// Hook personalizado para manejar el modo oscuro
const THEME_KEY = "theme";

export function useDarkMode() {
    // Estado para saber si el modo oscuro está activo o no
    const [isDark, setIsDark] = useState<boolean>(() => {
        const stored = localStorage.getItem(THEME_KEY);

        if (stored) {
        return stored === "dark";
        }

        // fallback: sistema operativo
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });
    useEffect(() => {
        const root = document.documentElement;
        // Si el modo oscuro está activo, añadimos la clase "dark" y guardamos la preferencia en localStorage
        if (isDark) {
            root.classList.add("dark");
            localStorage.setItem(THEME_KEY, "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem(THEME_KEY, "light");
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark((prev) => !prev);

    return { isDark, toggleTheme };
}