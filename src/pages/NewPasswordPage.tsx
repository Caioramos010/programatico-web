import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import AuthLayout from "../components/auth/AuthLayout";

const inputClass =
  "!bg-white/20 !text-[var(--color-text-primary)] !placeholder:text-white/80 !border-[var(--color-login-border)]";

export default function NewPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem. Digite novamente.");
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />

        <Input
          darkBackground={false}
          type="password"
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={inputClass}
        />

        {error && (
          <p className="text-xs text-[var(--color-error-heart)] text-center">
            {error}
          </p>
        )}

        <Button type="submit" variant="white" className="w-full">
          Redefinir senha
        </Button>
      </form>
    </AuthLayout>
  );
}
