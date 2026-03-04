import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import AuthLayout from "../components/auth/AuthLayout";
import OrDivider from "../components/auth/OrDivider";

const inputClass =
  "!bg-white/20 !text-[var(--color-text-primary)] !placeholder:text-white/80 !border-[var(--color-login-border)]";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <Input
          darkBackground={false}
          type="text"
          placeholder="E-mail ou nome de usuário"
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

        <Button type="submit" variant="white" className="w-full">
          Entrar
        </Button>

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
