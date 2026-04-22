import { useState, useEffect } from "react";

interface Props {
  displayData: string;
  imageData: string | null;
  onAnswer: (answer: string) => void;
  disabled: boolean;
}

interface MultipleChoiceData {
  options: Array<{ image: string; description: string }>;
}

export default function MultipleChoiceExercise({
  displayData,
  imageData,
  onAnswer,
  disabled,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [displayData]);

  const data: MultipleChoiceData = (() => {
    try {
      return JSON.parse(displayData);
    } catch {
      return { options: [] };
    }
  })();

  function handleSelect(description: string) {
    if (disabled) return;
    setSelected(description);
    onAnswer(description);
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      {imageData && (
        <img
          src={imageData}
          alt="Ilustração do exercício"
          className="w-40 h-40 object-contain rounded-xl"
        />
      )}

      <div className="grid grid-cols-2 gap-3 w-full">
        {data.options.map((opt) => {
          const isSelected = selected === opt.description;
          return (
            <button
              key={opt.description}
              type="button"
              disabled={disabled}
              onClick={() => handleSelect(opt.description)}
              className={[
                "flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 min-h-[100px] transition-all duration-150 font-fredoka text-sm text-center",
                isSelected
                  ? "border-[var(--color-accent-light)] bg-[var(--color-accent-light)]/20 text-[var(--color-text-primary)]"
                  : "border-[var(--color-gray-border)] bg-[var(--color-bg-card-inner)] text-[var(--color-text-secondary)] hover:border-white/40 hover:bg-[var(--color-bg-card-inner)]/80",
                disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer",
              ].join(" ")}
            >
              {opt.image && (
                <img
                  src={opt.image}
                  alt={opt.description}
                  className="w-14 h-14 object-contain"
                />
              )}
              <span className="leading-tight">{opt.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
