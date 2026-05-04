import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import AuthLayout from "../components/auth/AuthLayout";
import OrDivider from "../components/auth/OrDivider";
import { useFormValidation, rules } from "../hooks/useFormValidation";
import { authService } from "../services/authService";
import { parseApiError } from "../utils/parseApiError";
import { useAuthStore } from "../stores/authStore";

const inputClass =
  "!bg-white/20 !text-[var(--color-text-primary)] !placeholder:text-white/80 !border-[var(--color-login-border)]";

const schema = {
  code: [rules.required("Código"), rules.code(6)],
};

type LoginVerifyState = { emailOuUsername: string; senha: string };

export default function LoginVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LoginVerifyState | undefined;

  const [code, setCode] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const { validate, onBlur, onChange, fieldError, formError, setFormError } = useFormValidation(schema);
  const storeLogin = useAuthStore((s) => s.login);

  const values = () => ({ code });

  useEffect(() => {
    if (!state?.emailOuUsername || !state?.senha) {
      navigate("/login", { replace: true });
    }
  }, [state, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(values()) || !state) return;

    setIsSubmitting(true);
    setFormError("");
    try {
      const data = await authService.confirmarLogin(state.emailOuUsername, state.senha, code);
      storeLogin(data.token, data.usuario);
      navigate(data.usuario.nivelHabilidade ? "/aprender" : "/onboarding");
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
      onClose={() => navigate("/login")}
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
            <p className="mt-2 text-base text-[var(--color-text-secondary)] text-center">{resendMessage}</p>
          )}

          <p className="mt-6 text-base text-[var(--color-text-secondary)] text-center leading-relaxed">
            Ao entrar ou se registrar no programático você concorda com todos os{" "}
            <a
              href="#termos"
              className="underline text-[var(--color-text-primary)] hover:text-white/90 transition-colors"
            >
              termos do site
            </a>
            .
          </p>
        </>
      }
    >
      <form
        className="flex flex-col gap-4"
        noValidate
        onSubmit={handleSubmit}
      >
        <Input
          darkBackground={false}
          type="text"
          placeholder="Insira o código que chegou no seu e-mail"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            onChange("code", e.target.value, values());
          }}
          onBlur={() => onBlur("code", code, values())}
          error={fieldError("code")}
          className={inputClass}
        />

        <Button type="submit" variant="white" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>

        {formError && (
          <p className="text-base text-error-heart text-center -mt-1">{formError}</p>
        )}
      </form>
    </AuthLayout>
  );
}
