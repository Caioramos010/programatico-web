import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";

const inputClass =
  "!bg-white/20 !text-[var(--color-text-primary)] !placeholder:text-white/80 !border-[var(--color-login-border)]";

export default function LoginVerificacaoPage() {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState("");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-[var(--color-bg-primary)]">
      <button
        type="button"
        onClick={() => navigate("/login")}
        className="absolute right-6 top-6 z-10 p-2 text-white/90 hover:text-white transition-colors rounded-lg hover:bg-white/10"
        aria-label="Fechar"
      >
        <X size={24} strokeWidth={2} />
      </button>

      <div
        className="w-full max-w-[400px] mx-4 rounded-2xl p-8 shadow-xl"
        style={{
          background: "var(--color-login-glass)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--color-login-border)",
        }}
      >
        <h1 className="text-2xl font-semibold text-center text-[var(--color-text-primary)] mb-2">
          Entrar
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] text-center mb-6">
          Para a sua segurança pedimos uma verificação de duas etapas ao
          realizar o login na plataforma.
        </p>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <Input
            darkBackground={false}
            type="text"
            placeholder="Insira o código que chegou no seu e-mail"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className={inputClass}
          />

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl font-fredoka font-semibold text-sm uppercase tracking-wider bg-white text-gray-700 shadow-md hover:bg-gray-50 transition-colors"
          >
            Entrar
          </button>
        </form>

        <div className="flex items-center gap-3 mt-5 mb-10 w-full">
          <span className="flex-1 border-t border-[var(--color-login-border)]" />
          <span className="text-sm font-medium text-[var(--color-text-primary)] shrink-0">
            OU
          </span>
          <span className="flex-1 border-t border-[var(--color-login-border)]" />
        </div>

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
      </div>
    </div>
  );
}
