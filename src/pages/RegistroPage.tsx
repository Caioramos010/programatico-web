import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";

const inputClass =
  "!bg-white/20 !text-white !placeholder:text-white/80 !border-white/40";

export default function RegistroPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [idade, setIdade] = useState("");
  const [aceiteTermos, setAceiteTermos] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-[#363C4E]">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute right-6 top-6 z-10 p-2 text-white/90 hover:text-white transition-colors rounded-lg hover:bg-white/10"
        aria-label="Fechar"
      >
        <X size={24} strokeWidth={2} />
      </button>

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
          Crie o seu perfil
        </h1>

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
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
            className={inputClass}
            min={1}
            max={120}
          />

          <label className="flex items-start gap-3 cursor-pointer text-xs text-white leading-relaxed">
            <input
              type="checkbox"
              checked={aceiteTermos}
              onChange={(e) => setAceiteTermos(e.target.checked)}
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

          <button
            type="submit"
            disabled={!aceiteTermos}
            className="w-full py-3 px-4 rounded-xl font-fredoka font-semibold text-sm uppercase tracking-wider bg-white text-gray-700 shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            Criar conta
          </button>
        </form>

        <div className="flex items-center gap-3 mt-10 mb-10 w-full">
          <span className="flex-1 border-t border-white/50" />
          <span className="text-sm font-medium text-white shrink-0">ou</span>
          <span className="flex-1 border-t border-white/50" />
        </div>

        <Button
          type="button"
          variant="neutral"
          className="w-full !bg-transparent !border-2 !border-white/70 !border-b-white/70 text-white hover:!bg-white/10 hover:!border-white"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </div>
    </div>
  );
}
