import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import AuthLayout from "../components/auth/AuthLayout";

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

    navigate("/login");
  };

  return (
    <AuthLayout
      title="Nova senha"
      subtitle="Digite sua nova senha e confirme para concluir a redefinição."
      onClose={() => navigate("/redefinir-senha")}
    >
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

        <Button type="submit" variant="white" className="w-full">
          Redefinir senha
        </Button>
      </form>
    </AuthLayout>
  );
}
