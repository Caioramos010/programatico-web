import { Target, Clock, Zap } from "lucide-react";

interface Props {
  xpEarned: number;
  accuracy: number;
  durationSeconds: number;
  onContinue: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function ConclusionScreen({ xpEarned, accuracy, durationSeconds, onContinue }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "var(--color-bg-primary)" }}
    >
      <div className="flex flex-col items-center gap-8 px-8 py-12 max-w-sm w-full text-center">
        <div className="flex flex-col gap-2">
          <h1 className="font-fredoka font-semibold text-3xl leading-tight text-[var(--color-text-primary)]">
            Você conseguiu!
          </h1>
          <p className="font-fredoka text-[var(--color-text-muted)] text-sm leading-snug">
            Você completou a prática, parabéns.
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-4 justify-center flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-gray-border)]">
            <Target size={18} className="text-[var(--color-text-muted)]" />
            <span className="font-fredoka font-semibold text-[var(--color-text-primary)] text-sm">
              {accuracy}%
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-gray-border)]">
            <Clock size={18} className="text-[var(--color-text-muted)]" />
            <span className="font-fredoka font-semibold text-[var(--color-text-primary)] text-sm">
              {formatTime(durationSeconds)}
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-gray-border)]">
            <Zap size={18} className="text-[var(--color-premium)]" fill="currentColor" />
            <span className="font-fredoka font-semibold text-[var(--color-premium)] text-sm">
              {xpEarned}XP
            </span>
          </div>
        </div>

        {/* Mascote */}
        <div className="w-52 h-52">
          <span className="text-[208px] leading-none" role="img" aria-label="mascote">🦒</span>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="w-full py-4 rounded-2xl font-fredoka font-semibold text-base tracking-wide bg-[var(--color-accent-light)] text-white hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
        >
          CONTINUAR
        </button>
      </div>
    </div>
  );
}
