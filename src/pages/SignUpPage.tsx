import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import AuthLayout from "../components/auth/AuthLayout";
import OrDivider from "../components/auth/OrDivider";

const inputClass =
  "!bg-white/20 !text-[var(--color-text-primary)] !placeholder:text-white/80 !border-[var(--color-login-border)]";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

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
        onSubmit={(e) => e.preventDefault()}
      >
        <Input
          darkBackground={false}
          type="text"
          placeholder="Nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={inputClass}
        />

        <Input
          darkBackground={false}
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />

        <Input
          darkBackground={false}
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />

        <Input
          darkBackground={false}
          type="number"
          placeholder="Idade"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className={inputClass}
          min={1}
          max={120}
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
            <a
              href="#termos"
              className="underline hover:text-white/90 transition-colors"
            >
              termos do site
            </a>
            .
          </span>
        </label>

        <Button type="submit" variant="white" disabled={!acceptTerms} className="w-full">
          Criar conta
        </Button>
      </form>
    </AuthLayout>
  );
}
