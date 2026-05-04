import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

export default function ResetPasswordCodePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email: string = location.state?.email ?? "";

  const [code, setCode] = useState("");
  const { validate, onBlur, onChange, fieldError, formError, setFormError } =
    useFormValidation(schema);

  const values = () => ({ code });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(values())) return;
    navigate("/redefinir-senha/nova", { state: { codigo: code } });
  };

  const handleReenviar = async () => {
    if (!email) return;
    try {
      await authService.solicitarRedefinicao(email);
    } catch (err) {
      const { formError: msg } = parseApiError(err);
      if (msg) setFormError(msg);
    }
  };

  return (
    <AuthLayout
      title="Redefinir senha"
      subtitle="Insira o código que chegou no seu e-mail para continuar."
      onClose={() => navigate("/redefinir-senha")}
      footer={
        <>
          <OrDivider />
          <Button
            type="button"
            variant="neutral"
            className="w-full !bg-transparent !border-2 !border-[var(--color-login-border)] !border-b-[var(--color-login-border)] text-[var(--color-text-primary)] hover:!bg-white/10 hover:!border-white"
            onClick={handleReenviar}
          >
            Reenviar
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-4" noValidate onSubmit={handleSubmit}>
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

        <Button type="submit" variant="white" className="w-full">
          Continuar
        </Button>

        {formError && (
          <p className="text-base text-error-heart text-center -mt-1">{formError}</p>
        )}
      </form>
    </AuthLayout>
  );
}
