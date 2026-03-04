import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import AuthLayout from "../../components/auth/AuthLayout";

const isAdminSubdomain = window.location.hostname.startsWith("admin.");
const basePath = isAdminSubdomain ? "" : "/admin";

const inputClass =
  "!bg-white/20 !text-[var(--color-text-primary)] !placeholder:text-white/80 !border-[var(--color-login-border)]";

export default function AdminNovaSenhaPage() {
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

    navigate(`${basePath}/login`);
  };

  return (
    <AuthLayout
      title="Nova senha"
      subtitle="Digite sua nova senha e confirme para concluir a redefinição."
      variant="admin"
      adminBadge
      onClose={() => navigate(`${basePath}/redefinir-senha`)}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          type="password"
          placeholder="Nova senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className={inputClass}
        />

        <Input
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
