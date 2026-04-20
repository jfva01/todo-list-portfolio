import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearTokens } from "../auth/tokenService";
import { getUserFromToken } from "../auth/authService";
import { SquareArrowRightExit } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { getApiVersion } from "../api/infoApi";

export function Header() {
    const navigate = useNavigate();

    const user = getUserFromToken();
    
    const handleLogout = () => {
        clearTokens();
        navigate("/login", { replace: true });
    };

    const { isDark, toggleTheme } = useDarkMode();

    const [version, setVersion] = useState("");
    
    useEffect(() => {
        const fetchVersion = async () => {
            const data = await getApiVersion();
            setVersion(data.version);
        };

        fetchVersion();
    }, []);

    return (
        <>
            <div className="flex justify-center items-center mb-6">
                <span className="text-center">
                    <h1 className="text-2xl font-bold text-slate-500 dark:text-slate-400">
                        ToDo App
                    </h1>
                    <p className="text-sm text-slate-400">versión: {version}</p>
                </span>
            </div>
            <div className="flex justify-center items-center mb-6">
                <label className="font-bold text-slate-500 dark:text-slate-400">Usuario: </label>
                <span className="pl-1 text-sm text-slate-500 dark:text-slate-400">
                    {user?.email || user?.name || "Usuario"}
                </span>
            </div>
            <div className="flex justify-between items-center mb-6">
                <div className="inline-flex justify-center items-center gap-2">
                    <span className="font-bold text-sm text-slate-500">
                        Dark Mode: 
                    </span> 
                    <button
                        onClick={toggleTheme}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                            ${isDark ? "bg-blue-600" : "bg-slate-300"}`}
                        >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                            ${isDark ? "translate-x-6" : "translate-x-1"}`}
                        />
                    </button>
                </div>
                <button
                    onClick={handleLogout}
                    className="cursor-pointer font-medium inline-flex items-center justify-center gap-2 px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
                >
                    <SquareArrowRightExit className="w-4 h-4" />
                    <span>Logout</span>
                </button>
            </div>
        </>
    );
}