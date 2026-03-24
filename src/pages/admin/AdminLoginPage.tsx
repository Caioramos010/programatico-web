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
  email: [rules.required("E-mail")],
  password: [rules.required("Senha")],
};

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { validate, onBlur, onChange, fieldError } = useFormValidation(schema);

  const values = { email, password };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(values)) return;
    navigate(`${basePath}/login/verificacao`);
  };

  return (
    <AuthLayout
      title="Entrar"
      variant="admin"
      adminBadge
      onClose={() => navigate("/")}
    >
      <form className="flex flex-col gap-4" noValidate onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="E-mail ou nome de usuário"
          value={email}
          onChange={(e) => { setEmail(e.target.value); onChange("email", e.target.value, { ...values, email: e.target.value }); }}
          onBlur={() => onBlur("email", email, values)}
          error={fieldError("email")}
          className={inputClass}
        />

        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => { setPassword(e.target.value); onChange("password", e.target.value, { ...values, password: e.target.value }); }}
          onBlur={() => onBlur("password", password, values)}
          error={fieldError("password")}
          className={inputClass}
        />

        <Button type="submit" variant="white" className="w-full">
          Entrar
        </Button>

        <button
          type="button"
          onClick={() => navigate(`${basePath}/redefinir-senha`)}
          className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-center block w-full"
        >
          Esqueceu a senha?
        </button>
      </form>
    </AuthLayout>
  );
}
