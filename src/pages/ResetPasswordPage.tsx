import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import AuthLayout from "../components/auth/AuthLayout";
import { useFormValidation, rules } from "../hooks/useFormValidation";
import { authService } from "../services/authService";
import { parseApiError } from "../utils/parseApiError";

const inputClass =
  "!bg-white/20 !text-[var(--color-text-primary)] !placeholder:text-white/80 !border-[var(--color-login-border)]";

const schema = {
  email: [rules.required("E-mail"), rules.email()],
};

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const { validate, onBlur, onChange, fieldError, formError, setFormError, setServerErrors } =
    useFormValidation(schema);

  const values = () => ({ email });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(values())) return;

    try {
      await authService.solicitarRedefinicao(email);
      navigate("/redefinir-senha/codigo", { state: { email } });
    } catch (err) {
      const { fieldErrors, formError: msg } = parseApiError(err);
      if (fieldErrors) setServerErrors(fieldErrors);
      if (msg) setFormError(msg);
    }
  };

  return (
    <AuthLayout
      title="Redefinir senha"
      subtitle="Insira o e-mail cadastrado e enviaremos um código para redefinir sua senha."
      onClose={() => navigate("/login")}
    >
      <form className="flex flex-col gap-4" noValidate onSubmit={handleSubmit}>
        <Input
          darkBackground={false}
          type="text"
          placeholder="E-mail"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            onChange("email", e.target.value, values());
          }}
          onBlur={() => onBlur("email", email, values())}
          error={fieldError("email")}
          className={inputClass}
        />

        <Button type="submit" variant="white" className="w-full">
          Enviar código
        </Button>

        {formError && (
          <p className="text-xs text-error-heart text-center -mt-1">{formError}</p>
        )}
      </form>
    </AuthLayout>
  );
}
