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

  const { validate, onBlur, onChange, fieldError, formError, setFormError, setServerErrors } = useFormValidation(schema);
  const storeLogin = useAuthStore((s) => s.login);

  const values = () => ({ email, password });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(values())) return;

    try {
      const data = await authService.login(email, password);
      storeLogin(data.token, data.usuario);
      navigate("/aprender");
    } catch (err) {
      const { fieldErrors, formError: msg } = parseApiError(err);
      if (fieldErrors) setServerErrors(fieldErrors);
      if (msg) setFormError(msg);
    }
  };

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

        <Button type="submit" variant="white" className="w-full">
          Entrar
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
