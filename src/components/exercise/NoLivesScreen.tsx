import { Crown } from "lucide-react";
import { Sad } from "../mascot";

interface Props {
  onSubscribe: () => void;
  onBack: () => void;
}

export default function NoLivesScreen({ onSubscribe, onBack }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "var(--color-bg-primary)" }}
    >
      <div className="flex flex-col items-center gap-8 px-8 py-12 max-w-sm w-full text-center">
        <div className="flex flex-col gap-2">
          <h1 className="font-fredoka font-semibold text-3xl leading-tight text-[var(--color-text-primary)]">
            Suas vidas acabaram
          </h1>
          <p className="font-fredoka text-lg md:text-xl text-[var(--color-text-secondary)] leading-relaxed">
            Seja root e tenha vidas ilimitadas, foque em seu aprendizado!
          </p>
        </div>

        {/* Mascote triste */}
        <div className="w-52 h-52">
          <Sad className="w-full h-full" />
        </div>

        <button
          type="button"
          onClick={onSubscribe}
          className="w-full py-4 rounded-2xl bg-white text-[var(--color-bg-primary)] font-fredoka font-semibold text-base tracking-wide hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Crown size={18} className="shrink-0" />
          ASSINE AGORA!
        </button>

        <button
          type="button"
          onClick={onBack}
          className="font-fredoka text-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
        >
          Talvez depois...
        </button>
      </div>
    </div>
  );
}
