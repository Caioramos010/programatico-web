import { XCircle } from "lucide-react";

interface Props {
  correctAnswer: string;
  exerciseType: "DRAG_DROP" | "PAIRS" | "MULTIPLE_CHOICE";
  relatedTopics: string[];
  onProceed: () => void;
}

function formatCorrectAnswer(exerciseType: string, answerJson: string): string {
  try {
    if (exerciseType === "MULTIPLE_CHOICE") {
      return answerJson;
    }
    if (exerciseType === "DRAG_DROP") {
      const items: string[] = JSON.parse(answerJson);
      return items.map((item, i) => `${i + 1}. ${item}`).join(" → ");
    }
    if (exerciseType === "PAIRS") {
      const pairs: Array<{ left: string; right: string }> = JSON.parse(answerJson);
      return pairs.map((p) => `${p.left} \u2192 ${p.right}`).join("\n");
    }
  } catch {
    /* no-op */
  }
  return answerJson;
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

      <div className="rounded-xl bg-[var(--color-error-light)] border border-[var(--color-error-heart)]/30 px-4 py-3">
        <p className="font-fredoka text-lg md:text-xl text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
          {formatCorrectAnswer(exerciseType, correctAnswer)}
        </p>
      </div>

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
