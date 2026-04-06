import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import AuthLayout from "../../components/auth/AuthLayout";
import { useFormValidation, rules } from "../../hooks/useFormValidation";
import { useAdminAuthStore } from "../../stores/adminAuthStore";
import { authService } from "../../services/authService";
import { parseApiError } from "../../utils/parseApiError";

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
  const login = useAdminAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { validate, onBlur, onChange, fieldError } = useFormValidation(schema);

  const values = { email, password };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(values)) return;
    setFormError(null);
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      if (data.usuario.role !== "ADMIN") {
        setFormError("Acesso restrito a administradores.");
        return;
      }
      login(data.token, {
        id: data.usuario.id,
        username: data.usuario.username,
        email: data.usuario.email,
        role: data.usuario.role as string,
      });
      navigate(`${basePath}/dashboard`);
    } catch (err) {
      const { formError: msg } = parseApiError(err);
      setFormError(msg ?? "Erro ao entrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
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

        {formError && (
          <p className="text-sm text-[var(--color-error-heart)] text-center">{formError}</p>
        )}

        <Button type="submit" variant="white" className="w-full" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
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
