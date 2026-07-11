import { Target, Clock, Zap } from "lucide-react";
import { Excited } from "../mascot";
import { useAuthStore } from "../../stores/authStore";
import { isActiveRoot } from "../../lib/subscription";

interface SubjectReviewItem {
  assunto: string;
  acertos: number;
  erros: number;
}

interface Props {
  xpEarned: number;
  accuracy: number;
  durationSeconds: number;
  subjectReview?: SubjectReviewItem[];
  onContinue: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function ConclusionScreen({ xpEarned, accuracy, durationSeconds, subjectReview, onContinue }: Props) {
  const isRoot = isActiveRoot(useAuthStore((s) => s.user));
  const review = isRoot && subjectReview ? [...subjectReview].sort((a, b) => b.erros - a.erros).slice(0, 8) : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
      style={{ background: "var(--color-bg-primary)" }}
    >
      <div className="flex flex-col items-center gap-8 px-8 py-12 max-w-sm w-full text-center">
        <div className="flex flex-col gap-2">
          <h1 className="font-fredoka font-semibold text-3xl leading-tight text-[var(--color-text-primary)]">
            Você conseguiu!
          </h1>
          <p className="font-fredoka text-lg md:text-xl text-[var(--color-text-secondary)] leading-relaxed">
            Você completou a prática, parabéns.
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-4 justify-center flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-gray-border)]">
            <Target size={18} className="text-[var(--color-text-muted)]" />
            <span className="font-fredoka font-semibold text-[var(--color-text-primary)] text-base">
              {accuracy}%
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-gray-border)]">
            <Clock size={18} className="text-[var(--color-text-muted)]" />
            <span className="font-fredoka font-semibold text-[var(--color-text-primary)] text-base">
              {formatTime(durationSeconds)}
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-gray-border)]">
            <Zap size={18} className="text-[var(--color-premium)]" fill="currentColor" />
            <span className="font-fredoka font-semibold text-[var(--color-premium)] text-base">
              {xpEarned}XP
            </span>
          </div>
        </div>

        {/* Review por assunto (Root) */}
        {review.length > 0 && (
          <div className="w-full">
            <p className="text-sm text-[var(--color-text-muted)] mb-2 text-left">Revisão por assunto</p>
            <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-1">
              {review.map((s) => {
                const total = s.acertos + s.erros;
                const pct = total > 0 ? (s.acertos / total) * 100 : 0;
                return (
                  <div key={s.assunto} className="text-left">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm text-[var(--color-text-primary)] truncate">{s.assunto}</span>
                      <span className="text-sm shrink-0 tabular-nums font-fredoka">
                        <span className="text-[var(--color-success)]">{s.acertos}</span>
                        <span className="text-[var(--color-text-muted)]"> / </span>
                        <span className="text-[var(--color-error-heart)]">{s.erros}</span>
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--color-error-light)] overflow-hidden">
                      <div className="h-full rounded-full bg-[var(--color-success)]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mascote */}
        <div className="w-52 h-52">
          <Excited className="w-full h-full" aria-label="Gina comemorando" />
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
