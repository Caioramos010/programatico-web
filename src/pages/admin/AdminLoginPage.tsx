import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Input from "../../components/Input";

const isAdminSubdomain = window.location.hostname.startsWith("admin.");
const basePath = isAdminSubdomain ? "" : "/admin";

const inputClass =
  "!bg-white/20 !text-[var(--color-text-primary)] !placeholder:text-white/80 !border-[var(--color-login-border)]";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`${basePath}/login/verificacao`);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative"
      style={{
        background:
          "linear-gradient(to bottom right, var(--color-admin-bg-start), var(--color-admin-bg-end))",
      }}
    >
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute right-6 top-6 z-10 p-2 text-white/90 hover:text-white transition-colors rounded-lg hover:bg-white/10"
        aria-label="Fechar"
      >
        <X size={24} strokeWidth={2} />
      </button>

      <div
        className="w-full max-w-[400px] mx-4 rounded-2xl p-8 shadow-xl"
        style={{
          background: "var(--color-login-glass)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--color-login-border)",
        }}
      >
        <h1 className="text-2xl font-semibold text-center text-[var(--color-text-primary)] mb-1">
          Entrar
        </h1>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-premium)] text-center mb-6">
          Administrador
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="E-mail ou nome de usuário"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />

          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl font-fredoka font-semibold text-sm uppercase tracking-wider bg-white text-gray-700 shadow-md hover:bg-gray-50 transition-colors"
          >
            Entrar
          </button>

          <button
            type="button"
            onClick={() => navigate(`${basePath}/redefinir-senha`)}
            className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-center block w-full"
          >
            Esqueceu a senha?
          </button>
        </form>
      </div>
    </div>
  );
}
