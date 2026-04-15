import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../auth/authService";
import { getToken } from "../auth/tokenService";

export default function LoginPage() {
    const navigate = useNavigate(); // Hook para redirigir al usuario después de un login exitoso
    // useEffect para verificar si el usuario ya tiene un token válido al cargar la página. 
    // Si es así, se redirige automáticamente a la página principal.
    useEffect(() => {
        if (getToken()) {
            navigate("/", { replace: true });
        }
    }, []);
    
    const [email, setEmail] = useState(""); // Estado para almacenar el email ingresado por el usuario
    const [password, setPassword] = useState(""); // Estado para almacenar la contraseña ingresada por el usuario

    const [loading, setLoading] = useState(false); // Estado para controlar el proceso de login
    const [error, setError] = useState<string | null>(null); // Estado para almacenar mensajes de error

    const handleSubmit = async (e: React.FormEvent) => {
        // Evitamos que el formulario recargue la página al hacer submit
        e.preventDefault();

        setError(null);
        setLoading(true);
        // Intentamos realizar el login con las credenciales ingresadas. 
        // Si es exitoso, se redirige a la página principal.
        try {
            await loginRequest(email, password);
            navigate("/");
        } catch (err: any) {
            setError(err.message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
                <h1 className="text-3xl font-bold text-center text-slate-800 mb-6">
                  Bienvenido a ToDo App
                </h1>
                <h2 className="text-2xl font-bold text-center mb-6">Iniciar sesión</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="sr-only block text-sm font-medium text-gray-700 ">Email</label>
                        <input
                            type="email"
                            id="email"                            
                            value={email}
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border border-slate-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="border border-slate-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        />
                    </div>
                    {/* Si hay un error, se muestra debajo del formulario */}
                    {error && (
                        <div className="text-red-500 text-sm">
                            {error}
                        </div>
                    )}
                    {/* El botón de submit se deshabilita mientras se está procesando el login para evitar múltiples envíos */}
                    <button 
                        type="submit"
                        disabled={loading}
                        data-testid="login-button"
                        className="w-full self-end inline-flex items-center justify-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400">
                        { loading ? ( <span className="animate-pulse">Ingresando...</span> ) : ( "Entrar" ) }
                    </button>
                    <p className="text-sm text-gray-500 text-center mt-4">
                        "Puedes usar la cuenta demo para probar la aplicación."
                    </p>
                </form>
            </div>
        </div>
    );
}