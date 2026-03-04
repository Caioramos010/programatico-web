import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import AuthLayout from "../components/auth/AuthLayout";
import OrDivider from "../components/auth/OrDivider";

const inputClass =
  "!bg-white/20 !text-[var(--color-text-primary)] !placeholder:text-white/80 !border-[var(--color-login-border)]";

export default function LoginVerificationPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

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
            onClick={() => {}}
          >
            Reenviar
          </Button>

          <p className="mt-6 text-xs text-[var(--color-text-secondary)] text-center leading-relaxed">
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
        onSubmit={(e) => e.preventDefault()}
      >
        <Input
          darkBackground={false}
          type="text"
          placeholder="Insira o código que chegou no seu e-mail"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={inputClass}
        />

        <Button type="submit" variant="white" className="w-full">
          Entrar
        </Button>
      </form>
    </AuthLayout>
  );
}
