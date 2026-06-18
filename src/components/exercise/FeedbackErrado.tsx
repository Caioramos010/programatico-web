import { XCircle } from "lucide-react";

interface Props {
  correctAnswer: string;
  exerciseType: "DRAG_DROP" | "PAIRS" | "MULTIPLE_CHOICE";
  relatedTopics: string[];
  onProceed: () => void;
}

function parse<T>(json: string): T | null {
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

function CorrectAnswerView({ exerciseType, correctAnswer }: { exerciseType: string; correctAnswer: string }) {
  if (exerciseType === "DRAG_DROP") {
    const items = parse<string[]>(correctAnswer);
    if (items && items.length > 0) {
      return (
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-bg-card-inner)] border-2 border-[var(--color-error-heart)]/40"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-error-heart)] text-white text-sm font-bold shrink-0">
                {i + 1}
              </span>
              <span className="font-fredoka text-base text-[var(--color-text-primary)]">{item}</span>
            </div>
          ))}
        </div>
      );
    }
  }

  if (exerciseType === "PAIRS") {
    const pairs = parse<Array<{ left: string; right: string }>>(correctAnswer);
    if (pairs && pairs.length > 0) {
      return (
        <div className="flex flex-col gap-2">
          {pairs.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--color-bg-card-inner)] border-2 border-[var(--color-error-heart)]/40"
            >
              <span className="font-fredoka text-base text-[var(--color-text-primary)] flex-1">{p.left}</span>
              <span className="text-[var(--color-error-heart)] font-bold shrink-0">→</span>
              <span className="font-fredoka text-base text-[var(--color-text-primary)] flex-1 text-right">{p.right}</span>
            </div>
          ))}
        </div>
      );
    }
  }

  // MULTIPLE_CHOICE (ou fallback): uma única resposta em destaque.
  return (
    <div className="rounded-xl bg-[var(--color-bg-card-inner)] border-2 border-[var(--color-error-heart)]/40 px-4 py-3">
      <span className="font-fredoka text-lg text-[var(--color-text-primary)]">{correctAnswer}</span>
    </div>
  );
}

export default function IncorrectFeedback({ correctAnswer, exerciseType, relatedTopics, onProceed }: Props) {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <XCircle size={32} className="text-[var(--color-error-heart)]" strokeWidth={2.5} />
        <span className="font-fredoka font-semibold text-xl text-[var(--color-error-heart)]">
          Resposta Correta
        </span>
      </div>

      <CorrectAnswerView exerciseType={exerciseType} correctAnswer={correctAnswer} />

      {relatedTopics.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="font-fredoka text-lg text-[var(--color-text-secondary)] uppercase tracking-wide">
            Assuntos relacionados
          </span>
          <div className="flex flex-wrap gap-2">
            {relatedTopics.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-[var(--color-error-light)] text-[var(--color-error-heart)] font-fredoka text-base"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onProceed}
        className="w-full mt-auto py-4 rounded-2xl font-fredoka font-semibold text-base tracking-wide bg-[var(--color-error-heart)] text-white hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
      >
        PROSSEGUIR
      </button>
    </div>
  );
}
