import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import AuthLayout from "../../components/auth/AuthLayout";
import OrDivider from "../../components/auth/OrDivider";
import { useFormValidation, rules } from "../../hooks/useFormValidation";
import { authService } from "../../services/authService";
import { parseApiError } from "../../utils/parseApiError";
import { useAdminAuthStore } from "../../stores/adminAuthStore";

const isAdminSubdomain = window.location.hostname.startsWith("admin.");
const basePath = isAdminSubdomain ? "" : "/admin";

const inputClass =
  "!bg-white/20 !text-[var(--color-text-primary)] !placeholder:text-white/80 !border-[var(--color-login-border)]";

const schema = {
  code: [rules.required("Código"), rules.code(6)],
};

type LoginVerifyState = { emailOuUsername: string; senha: string };

export default function AdminLoginVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LoginVerifyState | undefined;
  const login = useAdminAuthStore((s) => s.login);

  const [code, setCode] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const { validate, onBlur, onChange, fieldError, formError, setFormError } = useFormValidation(schema);

  const values = { code };

  useEffect(() => {
    if (!state?.emailOuUsername || !state?.senha) {
      navigate(`${basePath}/login`, { replace: true });
    }
  }, [state, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(values) || !state) return;

    setIsSubmitting(true);
    setFormError("");
    try {
      const data = await authService.confirmarLogin(state.emailOuUsername, state.senha, code);
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
      if (msg) setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReenviar = async () => {
    if (!state) return;
    setResendMessage("");
    setFormError("");
    setIsResending(true);
    try {
      const response = await authService.reenviarCodigoLogin(state.emailOuUsername, state.senha);
      setResendMessage(response.mensagem);
    } catch (err) {
      const { formError: msg } = parseApiError(err);
      if (msg) setFormError(msg);
    } finally {
      setIsResending(false);
    }
  };

  if (!state?.emailOuUsername || !state?.senha) {
    return null;
  }

  return (
    <AuthLayout
      title="Entrar"
      subtitle="Para a sua segurança pedimos uma verificação de duas etapas ao realizar o login na plataforma."
      variant="admin"
      adminBadge
      onClose={() => navigate(`${basePath}/login`)}
      footer={
        <>
          <OrDivider />
          <Button
            type="button"
            variant="neutral"
            className="w-full !bg-transparent !border-2 !border-[var(--color-login-border)] !border-b-[var(--color-login-border)] text-[var(--color-text-primary)] hover:!bg-white/10 hover:!border-white"
            onClick={handleReenviar}
            disabled={isResending}
          >
            {isResending ? "Reenviando..." : "Reenviar"}
          </Button>
          {resendMessage && (
            <p className="mt-2 text-xs text-[var(--color-text-secondary)] text-center">{resendMessage}</p>
          )}
        </>
      }
    >
      <form className="flex flex-col gap-4" noValidate onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Insira o código que chegou no seu e-mail"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            onChange("code", e.target.value, { code: e.target.value });
          }}
          onBlur={() => onBlur("code", code, values)}
          error={fieldError("code")}
          className={inputClass}
        />

        <Button type="submit" variant="white" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>

        {formError && (
          <p className="text-sm text-[var(--color-error-heart)] text-center">{formError}</p>
        )}
      </form>
    </AuthLayout>
  );
}
