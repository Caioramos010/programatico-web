import { CheckCircle } from "lucide-react";

interface Props {
  relatedTopics: string[];
  onProceed: () => void;
}

export default function CorrectFeedback({ relatedTopics, onProceed }: Props) {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <CheckCircle size={32} className="text-[var(--color-success)]" strokeWidth={2.5} />
        <span className="font-fredoka font-semibold text-xl text-[var(--color-success)]">
          Ótima resposta!
        </span>
      </div>

      {relatedTopics.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="font-fredoka text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
            Assuntos relacionados
          </span>
          <div className="flex flex-wrap gap-2">
            {relatedTopics.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-[var(--color-success)]/15 text-[var(--color-success)] font-fredoka text-sm"
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
        className="w-full mt-auto py-4 rounded-2xl font-fredoka font-semibold text-base tracking-wide bg-[var(--color-success)] text-white hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
      >
        PROSSEGUIR
      </button>
    </div>
  );
}
