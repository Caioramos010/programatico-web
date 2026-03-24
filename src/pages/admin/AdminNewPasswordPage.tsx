import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import AuthLayout from "../../components/auth/AuthLayout";
import { useFormValidation, rules } from "../../hooks/useFormValidation";

const isAdminSubdomain = window.location.hostname.startsWith("admin.");
const basePath = isAdminSubdomain ? "" : "/admin";

const inputClass =
  "!bg-white/20 !text-[var(--color-text-primary)] !placeholder:text-white/80 !border-[var(--color-login-border)]";

const schema = {
  password: [rules.required("Senha"), rules.minLength(6, "Senha"), rules.noSpaces("Senha")],
  confirmPassword: [rules.required("Confirmação"), rules.matches("password", "Senhas")],
};

export default function AdminNewPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { validate, onBlur, onChange, fieldError } = useFormValidation(schema);

  const values = { password, confirmPassword };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(values)) return;
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
      <form className="flex flex-col gap-4" noValidate onSubmit={handleSubmit}>
        <Input
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={(e) => { setPassword(e.target.value); onChange("password", e.target.value, { ...values, password: e.target.value }); }}
          onBlur={() => onBlur("password", password, values)}
          error={fieldError("password")}
          className={inputClass}
        />

        <Input
          type="password"
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChange={(e) => { setConfirmPassword(e.target.value); onChange("confirmPassword", e.target.value, { ...values, confirmPassword: e.target.value }); }}
          onBlur={() => onBlur("confirmPassword", confirmPassword, values)}
          error={fieldError("confirmPassword")}
          className={inputClass}
        />

        <Button type="submit" variant="white" className="w-full">
          Redefinir senha
        </Button>
      </form>
    </AuthLayout>
  );
}
