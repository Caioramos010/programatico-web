import { useState, useEffect } from "react";

interface Props {
  displayData: string;
  imageData: string | null;
  onAnswer: (answer: string) => void;
  disabled: boolean;
}

interface LogicFlowData {
  items: string[];
}

export default function LogicFlowExercise({
  displayData,
  imageData,
  onAnswer,
  disabled,
}: Props) {
  const data: LogicFlowData = (() => {
    try {
      return JSON.parse(displayData);
    } catch {
      return { items: [] };
    }
  })();

  const [remaining, setRemaining] = useState<string[]>(data.items);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const parsed: LogicFlowData = (() => {
      try {
        return JSON.parse(displayData);
      } catch {
        return { items: [] };
      }
    })();
    setRemaining(parsed.items);
    setSelected([]);
  }, [displayData]);

  function addItem(item: string) {
    if (disabled) return;
    const newRemaining = remaining.filter((i) => i !== item);
    const newSelected = [...selected, item];
    setRemaining(newRemaining);
    setSelected(newSelected);
    if (newRemaining.length === 0) {
      onAnswer(JSON.stringify(newSelected));
    }
  }

  function removeItem(item: string) {
    if (disabled) return;
    const newSelected = selected.filter((i) => i !== item);
    setSelected(newSelected);
    setRemaining([...remaining, item]);
    onAnswer("");
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

      {/* Answer area (selected order) */}
      <div className="w-full min-h-[52px] border-b-2 border-dashed border-[var(--color-gray-border)] flex flex-wrap gap-2 pb-2">
        {selected.length === 0 && (
          <span className="text-[var(--color-text-muted)] font-fredoka text-base self-center">
            Clique nos itens abaixo para ordenar
          </span>
        )}
        {selected.map((item) => (
          <button
            key={`sel-${item}`}
            type="button"
            disabled={disabled}
            onClick={() => removeItem(item)}
            className={[
              "px-4 py-2 rounded-xl border-2 font-fredoka text-base transition-all duration-150",
              "border-[var(--color-accent-light)] bg-[var(--color-accent-light)]/20 text-[var(--color-text-primary)]",
              disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:opacity-80",
            ].join(" ")}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Available items */}
      <div className="flex flex-wrap gap-2 justify-center w-full">
        {remaining.map((item) => (
          <button
            key={`rest-${item}`}
            type="button"
            disabled={disabled}
            onClick={() => addItem(item)}
            className={[
              "px-4 py-2 rounded-xl border-2 font-fredoka text-base transition-all duration-150",
              "border-[var(--color-gray-border)] bg-[var(--color-bg-card-inner)] text-[var(--color-text-secondary)]",
              disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:border-white/40",
            ].join(" ")}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
