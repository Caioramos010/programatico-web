import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import AuthLayout from "../components/auth/AuthLayout";
import OrDivider from "../components/auth/OrDivider";
import { useFormValidation, rules } from "../hooks/useFormValidation";
import { parseApiError } from "../utils/parseApiError";
import { authService } from "../services/authService";
import { useAuthStore } from "../stores/authStore";

const inputClass =
  "!bg-white/20 !text-[var(--color-text-primary)] !placeholder:text-white/80 !border-[var(--color-login-border)]";

const schema = {
  email: [rules.required("E-mail ou nome de usuário")],
  password: [rules.required("Senha")],
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Inline activation state
  const [showActivation, setShowActivation] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [activationCode, setActivationCode] = useState("");
  const [activationSubmitting, setActivationSubmitting] = useState(false);
  const [activationError, setActivationError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  const { validate, onBlur, onChange, fieldError, formError, setFormError, setServerErrors } = useFormValidation(schema);
  const storeLogin = useAuthStore((s) => s.login);

  const values = () => ({ email, password });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate(values())) return;

    setSubmitting(true);
    try {
      const data = await authService.login(email, password);
      storeLogin(data.token, data.usuario);
      navigate(data.usuario.nivelHabilidade ? "/aprender" : "/onboarding");
    } catch (err) {
      const { fieldErrors, formError: msg } = parseApiError(err);
      if (msg && /n[aã]o ativad/i.test(msg)) {
        const trimmed = email.trim();
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
        const emailToUse = isEmail ? trimmed : "";
        setPendingEmail(emailToUse);
        setShowActivation(true);
        if (emailToUse) {
          try {
            const res = await authService.solicitarAtivacao(emailToUse);
            setResendMessage(res.mensagem || `Código enviado para ${emailToUse}`);
          } catch {
            setResendMessage(`Não foi possível reenviar o código. Tente novamente.`);
          }
        }
        return;
      }
      if (fieldErrors) setServerErrors(fieldErrors);
      if (msg) setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleActivation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activationSubmitting) return;
    if (!activationCode.trim()) {
      setActivationError("Insira o código de ativação.");
      return;
    }

    setActivationSubmitting(true);
    setActivationError("");
    try {
      await authService.ativar(activationCode.trim());
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
      const { formError: msg } = parseApiError(err);
      setActivationError(msg ?? "Código inválido. Tente novamente.");
    } finally {
      setActivationSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!pendingEmail || isResending) return;
    setIsResending(true);
    setResendMessage("");
    setActivationError("");
    try {
      const res = await authService.solicitarAtivacao(pendingEmail);
      setResendMessage(res.mensagem || `Código reenviado para ${pendingEmail}`);
    } catch (err) {
      const { formError: msg } = parseApiError(err);
      setActivationError(msg ?? "Não foi possível reenviar o código.");
    } finally {
      setIsResending(false);
    }
  };

  if (showActivation) {
    return (
      <AuthLayout
        title="Ativar conta"
        subtitle={
          pendingEmail
            ? `Enviamos um código para ${pendingEmail}`
            : "Insira o código de ativação enviado ao seu e-mail."
        }
        onClose={() => navigate("/")}
        footer={
          <>
            <OrDivider />
            <Button
              type="button"
              variant="neutral"
              className="w-full !bg-transparent !border-2 !border-[var(--color-login-border)] !border-b-[var(--color-login-border)] text-[var(--color-text-primary)] hover:!bg-white/10 hover:!border-white"
              onClick={() => {
                setShowActivation(false);
                setActivationCode("");
                setActivationError("");
                setResendMessage("");
              }}
            >
              Voltar ao login
            </Button>
          </>
        }
      >
        <form className="flex flex-col gap-4" noValidate onSubmit={handleActivation}>
          {resendMessage && (
            <p className="text-xs text-[var(--color-text-secondary)] text-center">{resendMessage}</p>
          )}

          <Input
            darkBackground={false}
            type="text"
            placeholder="Código de ativação"
            value={activationCode}
            onChange={(e) => {
              setActivationCode(e.target.value);
              setActivationError("");
            }}
            error={activationError || undefined}
            className={inputClass}
            autoFocus
          />

          <Button type="submit" variant="white" className="w-full" disabled={activationSubmitting}>
            {activationSubmitting ? "Ativando..." : "Ativar conta"}
          </Button>

          {activationError && (
            <p className="text-xs text-error-heart text-center -mt-1">{activationError}</p>
          )}

          {pendingEmail && (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-center block w-full disabled:opacity-50"
            >
              {isResending ? "Reenviando..." : "Reenviar código"}
            </button>
          )}
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Entrar"
      onClose={() => navigate("/")}
      footer={
        <>
          <OrDivider />
          <Button
            type="button"
            variant="neutral"
            className="w-full !bg-transparent !border-2 !border-[var(--color-login-border)] !border-b-[var(--color-login-border)] text-[var(--color-text-primary)] hover:!bg-white/10 hover:!border-white"
            onClick={() => navigate("/registro")}
          >
            Registro
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-4" noValidate onSubmit={handleSubmit}>
        <Input
          darkBackground={false}
          type="text"
          placeholder="E-mail ou nome de usuário"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            onChange("email", e.target.value, values());
          }}
          onBlur={() => onBlur("email", email, values())}
          error={fieldError("email")}
          className={inputClass}
        />

        <Input
          darkBackground={false}
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            onChange("password", e.target.value, values());
          }}
          onBlur={() => onBlur("password", password, values())}
          error={fieldError("password")}
          className={inputClass}
        />

        <Button type="submit" variant="white" className="w-full" disabled={submitting}>
          {submitting ? "Entrando..." : "Entrar"}
        </Button>

        {formError && (
          <p className="text-xs text-error-heart text-center -mt-1">{formError}</p>
        )}

        <button
          type="button"
          onClick={() => navigate("/redefinir-senha")}
          className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-center block w-full"
        >
          Esqueceu a senha?
        </button>
      </form>
    </AuthLayout>
  );
}
