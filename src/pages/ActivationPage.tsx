import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import AuthLayout from "../components/auth/AuthLayout";
import OrDivider from "../components/auth/OrDivider";
import { useFormValidation, rules } from "../hooks/useFormValidation";
import { authService } from "../services/authService";
import { parseApiError } from "../utils/parseApiError";

const inputClass =
  "!bg-white/20 !text-[var(--color-text-primary)] !placeholder:text-white/80 !border-[var(--color-login-border)]";

const schema = {
  code: [rules.required("Código"), rules.code(6)],
};

export default function ActivationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const activationEmail = useMemo(() => {
    const stateEmail = (location.state as { email?: string } | null)?.email?.trim();
    const storedEmail = sessionStorage.getItem("pendingActivationEmail")?.trim();
    return stateEmail || storedEmail || "";
  }, [location.state]);

  useEffect(() => {
    if (activationEmail) {
      sessionStorage.setItem("pendingActivationEmail", activationEmail);
    }
  }, [activationEmail]);

  const { validate, onBlur, onChange, fieldError, formError, setFormError, setServerErrors } = useFormValidation(schema);

  const values = () => ({ code });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate(values())) return;

    setSubmitting(true);
    try {
      await authService.ativar(code);
      sessionStorage.removeItem("pendingActivationEmail");
      navigate("/sucesso", {
        replace: true,
        state: {
          title: "Conta ativada",
          message: "Sua conta foi ativada com sucesso. Faça login para continuar.",
          ctaLabel: "Ir para o login",
          ctaTo: "/login",
        },
      });
    } catch (err) {
      const { fieldErrors, formError: msg } = parseApiError(err);
      if (fieldErrors) setServerErrors(fieldErrors);
      if (msg) setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    const normalizedEmail = activationEmail;
    setResendMessage("");
    setFormError("");

    if (!normalizedEmail) {
      setFormError("Não encontramos o e-mail do cadastro. Volte e faça o cadastro novamente.");
      return;
    }

    try {
      setIsResending(true);
      const response = await authService.solicitarAtivacao(normalizedEmail);
      setResendMessage(response.mensagem);
    } catch (err) {
      const { formError: msg } = parseApiError(err);
      setFormError(msg ?? "Não foi possível reenviar o código.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout
      title="Ativação"
      subtitle="Ao ativar sua conta você receberá um código no endereço de e-mail cadastrado."
      onClose={() => navigate("/")}
      footer={
        <>
          <OrDivider />
          <Button
            type="button"
            variant="neutral"
            className="w-full !bg-transparent !border-2 !border-[var(--color-login-border)] !border-b-[var(--color-login-border)] text-[var(--color-text-primary)] hover:!bg-white/10 hover:!border-white"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? "Reenviando..." : "Reenviar"}
          </Button>

          <p className="mt-6 text-xs text-[var(--color-text-secondary)] text-center leading-relaxed">
            Ao entrar ou se registrar no programático você concorda com todos os{" "}
            <Link
              to="/termos"
              className="underline text-[var(--color-text-primary)] hover:text-white/90 transition-colors"
            >
              termos do site
            </Link>
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
        {activationEmail && (
          <p className="text-xs text-[var(--color-text-secondary)] text-center">
            Código enviado para: <span className="text-[var(--color-text-primary)]">{activationEmail}</span>
          </p>
        )}

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

        <Button type="submit" variant="white" className="w-full" disabled={submitting}>
          {submitting ? "Ativando..." : "Entrar"}
        </Button>

        {formError && (
          <p className="text-xs text-error-heart text-center -mt-1">{formError}</p>
        )}

        {resendMessage && (
          <p className="text-xs text-[var(--color-text-secondary)] text-center -mt-1">{resendMessage}</p>
        )}
      </form>
    </AuthLayout>
  );
}
