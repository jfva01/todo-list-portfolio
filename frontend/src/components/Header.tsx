import { useNavigate } from "react-router-dom";
import { clearTokens } from "../auth/tokenService";
import { getUserFromToken } from "../auth/authService";

export function Header() {
    const navigate = useNavigate();

    const user = getUserFromToken();
    
    const handleLogout = () => {
        clearTokens();
        navigate("/login", { replace: true });
    };

    console.log(user);

    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800">
                ToDo App
            </h1>
            <div>
                <label className="font-bold">Usuario: </label>
                <span className="text-sm text-slate-600">
                    {user?.email || user?.name || "Usuario"}
                </span>
            </div>
            <button
                onClick={handleLogout}
                className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
                Logout
            </button>
        </div>
    );
}