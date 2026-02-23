import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-[#363C4E]">
      {/* Botão fechar - canto superior direito */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute right-6 top-6 z-10 p-2 text-white/90 hover:text-white transition-colors rounded-lg hover:bg-white/10"
        aria-label="Fechar"
      >
        <X size={24} strokeWidth={2} />
      </button>

      {/* Card com efeito glassmorphism */}
      <div
        className="w-full max-w-[400px] mx-4 rounded-2xl p-8 shadow-xl"
        style={{
          background: "rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
        }}
      >
        <h1 className="text-2xl font-semibold text-center text-white mb-6">
          Entrar
        </h1>

        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <Input
            darkBackground={false}
            type="text"
            placeholder="E-mail ou nome de usuário"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="!bg-white/20 !text-white !placeholder:text-white/80 !border-white/40"
          />

          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Input
                darkBackground={false}
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="!bg-white/20 !text-white !placeholder:text-white/80 !border-white/40"
              />
            </div>
            <a
              href="#esqueci"
              className="text-xs font-medium uppercase tracking-widest text-white/90 hover:text-white whitespace-nowrap shrink-0"
            >
              Esqueceu?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl font-fredoka font-semibold text-sm uppercase tracking-wider bg-white text-gray-700 shadow-md hover:bg-gray-50 transition-colors"
          >
            Entrar
          </button>
        </form>

        <div className="flex items-center gap-3 mt-10 mb-10 w-full">
          <span className="flex-1 border-t border-white/50" />
          <span className="text-sm font-medium text-white shrink-0">OU</span>
          <span className="flex-1 border-t border-white/50" />
        </div>

        <Button
          type="button"
          variant="neutral"
          className="w-full !bg-transparent !border-2 !border-white/70 !border-b-white/70 text-white hover:!bg-white/10 hover:!border-white"
          onClick={() => navigate("/registro")}
        >
          Registro
        </Button>
      </div>
    </div>
  );
}
