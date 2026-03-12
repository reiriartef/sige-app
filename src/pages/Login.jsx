import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { GraduationCap, Eye, EyeOff, ArrowLeft, Mail } from "lucide-react";
import useAuthStore from "../stores/authStore";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password flow
  const [view, setView] = useState("login"); // "login" | "forgot" | "forgot-sent"
  const [resetEmail, setResetEmail] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email);
    navigate("/");
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    // Mock: simulate email sent
    setView("forgot-sent");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">SIGE</h1>
          <p className="text-primary-200 text-sm mt-1">
            Sistema Inteligente de Gestión Estudiantil
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* -------- Login Form -------- */}
          {view === "login" && (
            <>
              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                Iniciar Sesión
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Ingresa tus credenciales para acceder al sistema
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="profesor@instituto.edu"
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    Recordarme
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setView("forgot");
                      setResetEmail("");
                    }}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Ingresar
                </button>
              </form>

              <p className="text-center text-xs text-slate-400 mt-6">
                Demo: cualquier credencial funciona
              </p>
            </>
          )}

          {/* -------- Forgot Password Form -------- */}
          {view === "forgot" && (
            <>
              <button
                onClick={() => setView("login")}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 transition-colors mb-4"
              >
                <ArrowLeft size={15} />
                Volver al inicio de sesión
              </button>

              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                Recuperar contraseña
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Ingresa tu correo electrónico y te enviaremos un enlace para
                restablecer tu contraseña.
              </p>

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="tu.correo@instituto.edu"
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Enviar enlace de recuperación
                </button>
              </form>
            </>
          )}

          {/* -------- Forgot Password Success -------- */}
          {view === "forgot-sent" && (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
                <Mail size={24} className="text-success-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">
                ¡Correo enviado!
              </h2>
              <p className="text-sm text-slate-500 mb-1">
                Hemos enviado un enlace de recuperación a:
              </p>
              <p className="text-sm font-medium text-slate-700 mb-6">
                {resetEmail}
              </p>
              <p className="text-xs text-slate-400 mb-6">
                Revisa tu bandeja de entrada y sigue las instrucciones del
                correo para restablecer tu contraseña.
              </p>
              <button
                onClick={() => setView("login")}
                className="w-full py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                Volver al inicio de sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
