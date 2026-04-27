import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  username: [rules.required("Nome de usuário"), rules.username()],
  email: [rules.required("E-mail"), rules.email()],
  password: [rules.required("Senha"), rules.minLength(8, "Senha"), rules.strongPassword()],
  age: [rules.required("Idade"), rules.minAge(12), rules.maxAge(120)],
};

export default function SignUpPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { validate, onBlur, onChange, fieldError, formError, setFormError, setServerErrors } = useFormValidation(schema);

  const values = () => ({ username, email, password, age });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(values())) return;

    try {
      await authService.registro({
        username,
        email,
        senha: password,
        idade: Number(age),
      });
      sessionStorage.setItem("pendingActivationEmail", email.trim());
      navigate("/ativacao", { state: { email: email.trim() } });
    } catch (err) {
      const { fieldErrors, formError: msg } = parseApiError(err);
      if (fieldErrors) setServerErrors(fieldErrors);
      if (msg) setFormError(msg);
    }
  };

  return (
    <AuthLayout
      title="Crie o seu perfil"
      onClose={() => navigate("/")}
      footer={
        <>
          <OrDivider />
          <Button
            type="button"
            variant="neutral"
            className="w-full !bg-transparent !border-2 !border-[var(--color-login-border)] !border-b-[var(--color-login-border)] text-[var(--color-text-primary)] hover:!bg-white/10 hover:!border-white"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
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
          placeholder="Nome de usuário"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            onChange("username", e.target.value, values());
          }}
          onBlur={() => onBlur("username", username, values())}
          error={fieldError("username")}
          className={inputClass}
        />

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

        <Input
          darkBackground={false}
          type="number"
          placeholder="Idade"
          value={age}
          onChange={(e) => {
            setAge(e.target.value);
            onChange("age", e.target.value, values());
          }}
          onBlur={() => onBlur("age", age, values())}
          error={fieldError("age")}
          className={inputClass}
        />

        <label className="flex items-start gap-3 cursor-pointer text-xs text-[var(--color-text-primary)] leading-relaxed">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-0.5 rounded border-white/60 bg-white/10 text-white focus:ring-white/40 focus:ring-2"
          />
          <span>
            Ao entrar ou se registrar no programático você concorda com todos
            os{" "}
            <Link
              to="/termos"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/90 transition-colors"
            >
              termos do site
            </Link>
            .
          </span>
        </label>

        <Button type="submit" variant="white" disabled={!acceptTerms} className="w-full">
          Criar conta
        </Button>

        {formError && (
          <p className="text-xs text-error-heart text-center -mt-1">{formError}</p>
        )}
      </form>
    </AuthLayout>
  );
}
