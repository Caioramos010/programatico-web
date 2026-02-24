import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";

const inputClass =
  "!bg-white/20 !text-[var(--color-text-primary)] !placeholder:text-white/80 !border-[var(--color-login-border)]";

export default function NovaSenhaPage() {
  const navigate = useNavigate();
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (senha.length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem. Digite novamente.");
      return;
    }

    // Aqui você pode chamar a API para alterar a senha e depois redirecionar
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-[var(--color-bg-primary)]">
      <button
        type="button"
        onClick={() => navigate("/redefinir-senha")}
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
        <h1 className="text-2xl font-semibold text-center text-[var(--color-text-primary)] mb-2">
          Nova senha
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] text-center mb-6">
          Digite sua nova senha e confirme para concluir a redefinição.
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            darkBackground={false}
            type="password"
            placeholder="Nova senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={inputClass}
          />

          <Input
            darkBackground={false}
            type="password"
            placeholder="Confirmar senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className={inputClass}
          />

          {erro && (
            <p className="text-xs text-[var(--color-error-heart)] text-center">
              {erro}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl font-fredoka font-semibold text-sm uppercase tracking-wider bg-white text-gray-700 shadow-md hover:bg-gray-50 transition-colors"
          >
            Redefinir senha
          </button>
        </form>
      </div>
    </div>
  );
}
