import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import AuthLayout from "../components/auth/AuthLayout";
import { useFormValidation, rules } from "../hooks/useFormValidation";
import { authService } from "../services/authService";
import { parseApiError } from "../utils/parseApiError";

const inputClass =
  "!bg-white/20 !text-[var(--color-text-primary)] !placeholder:text-white/80 !border-[var(--color-login-border)]";

const schema = {
  password: [
    rules.required("Senha"),
    rules.minLength(8, "Senha"),
    rules.noSpaces("Senha"),
    rules.strongPassword(),
  ],
  confirmPassword: [
    rules.required("Confirmação"),
    rules.matches("password", "Senhas"),
  ],
};

export default function NewPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const codigo: string = location.state?.codigo ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { validate, onBlur, onChange, fieldError, formError, setFormError, setServerErrors } =
    useFormValidation(schema);

  const values = () => ({ password, confirmPassword });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(values())) return;

    try {
      await authService.novaSenha(codigo, password);
      navigate("/login");
    } catch (err) {
      const { fieldErrors, formError: msg } = parseApiError(err);
      if (fieldErrors) setServerErrors(fieldErrors);
      if (msg) setFormError(msg);
    }
  };

  return (
    <AuthLayout
      title="Nova senha"
      subtitle="Digite sua nova senha e confirme para concluir a redefinição."
      onClose={() => navigate("/redefinir-senha/codigo")}
    >
      <form className="flex flex-col gap-4" noValidate onSubmit={handleSubmit}>
        <Input
          darkBackground={false}
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            onChange("password", e.target.value, values());
          }}
          onBlur={() => onBlur("password", password, values())}
          error={fieldError("password")}
          className={inputClass}
        />

        <Input
          darkBackground={false}
          type="password"
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            onChange("confirmPassword", e.target.value, { ...values(), confirmPassword: e.target.value });
          }}
          onBlur={() => onBlur("confirmPassword", confirmPassword, values())}
          error={fieldError("confirmPassword")}
          className={inputClass}
        />

        <Button type="submit" variant="white" className="w-full">
          Redefinir senha
        </Button>

        {formError && (
          <p className="text-base text-error-heart text-center -mt-1">{formError}</p>
        )}
      </form>
    </AuthLayout>
  );
}

