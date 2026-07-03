import { useState, useEffect } from "react";

interface Props {
  displayData: string;
  onAnswer: (answer: string) => void;
  disabled: boolean;
  /** JSON of [{left, right}] with correct pairs — when provided, shows red/green feedback */
  correctAnswer?: string;
}

interface MatchPairsData {
  lefts: string[];
  rights: string[];
}

interface CorrectPair {
  left: string;
  right: string;
}

export default function MatchPairsExercise({
  displayData,
  onAnswer,
  disabled,
  correctAnswer,
}: Props) {
  const data: MatchPairsData = (() => {
    try {
      return JSON.parse(displayData);
    } catch {
      return { lefts: [], rights: [] };
    }
  })();

  // Pairs are tracked by INDEX (position), never by the displayed text. Values
  // can legitimately repeat (e.g. several patterns map to "ciclo de 3"); keying
  // by value would light up and block every duplicate at once and produce
  // duplicate React keys.
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [pairs, setPairs] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    setSelectedLeft(null);
    setPairs(new Map());
    onAnswer("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayData]);

  const usedRights = new Set(pairs.values());

  function handleLeftClick(leftIndex: number) {
    // Already paired items cannot be undone
    if (disabled || pairs.has(leftIndex)) return;
    setSelectedLeft(leftIndex === selectedLeft ? null : leftIndex);
  }

  function handleRightClick(rightIndex: number) {
    // Already used right cannot be reassigned
    if (disabled || selectedLeft === null || usedRights.has(rightIndex)) return;
    const newPairs = new Map(pairs);
    newPairs.set(selectedLeft, rightIndex);
    setPairs(newPairs);
    setSelectedLeft(null);
    // Send all pairs formed so far (partial or complete) as values — the backend
    // validates by value, and duplicate right values are independently valid.
    const answer = Array.from(newPairs.entries()).map(([li, ri]) => ({
      left: data.lefts[li],
      right: data.rights[ri],
    }));
    onAnswer(JSON.stringify(answer));
  }

  const correctPairs: CorrectPair[] = (() => {
    if (!correctAnswer) return [];
    try { return JSON.parse(correctAnswer) as CorrectPair[]; } catch { return []; }
  })();

  function isPairCorrect(leftIndex: number): boolean {
    const rightIndex = pairs.get(leftIndex);
    if (rightIndex === undefined) return false;
    const left = data.lefts[leftIndex];
    const right = data.rights[rightIndex];
    return correctPairs.some(
      (p) => p.left.toLowerCase() === left.toLowerCase() && p.right.toLowerCase() === right.toLowerCase()
    );
  }

  function isRightCorrect(rightIndex: number): boolean {
    let leftIndex: number | undefined;
    pairs.forEach((ri, li) => { if (ri === rightIndex) leftIndex = li; });
    if (leftIndex === undefined) return false;
    const left = data.lefts[leftIndex];
    const right = data.rights[rightIndex];
    return correctPairs.some(
      (p) => p.left.toLowerCase() === left.toLowerCase() && p.right.toLowerCase() === right.toLowerCase()
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 w-full">
        {/* Coluna esquerda — conceitos */}
        <div className="flex flex-col gap-2">
          {data.lefts.map((left, i) => {
            const matched = pairs.has(i);
            const active = selectedLeft === i;
            return (
              <button
                key={`left-${i}`}
                type="button"
                disabled={disabled}
                onClick={() => handleLeftClick(i)}
                className={[
                  "px-3 py-3 rounded-2xl border-2 font-fredoka font-semibold text-base text-center transition-all duration-150 min-h-[52px] leading-tight",
                  matched && correctPairs.length > 0
                    ? isPairCorrect(i)
                      ? "border-[var(--color-success)] bg-[var(--color-success)]/20 text-[var(--color-text-primary)]"
                      : "border-[var(--color-error-heart)] bg-[var(--color-error-heart)]/15 text-[var(--color-text-primary)]"
                    : matched
                    ? "border-[var(--color-accent-light)] bg-[var(--color-accent-light)]/15 text-[var(--color-text-primary)]"
                    : active
                    ? "border-[var(--color-premium)] bg-[var(--color-bg-card-inner)] text-[var(--color-text-primary)] scale-[1.02]"
                    : "border-[var(--color-gray-border)] bg-[var(--color-bg-card-inner)] text-[var(--color-text-primary)]",
                  disabled ? "cursor-not-allowed" : "cursor-pointer hover:border-white/40 active:scale-95",
                ].join(" ")}
              >
                {left}
              </button>
            );
          })}
        </div>

        {/* Coluna direita — definições */}
        <div className="flex flex-col gap-2">
          {data.rights.map((right, i) => {
            const matched = usedRights.has(i);
            return (
              <button
                key={`right-${i}`}
                type="button"
                disabled={disabled}
                onClick={() => handleRightClick(i)}
                className={[
                  "px-3 py-3 rounded-2xl border-2 font-fredoka text-base text-center transition-all duration-150 min-h-[52px] leading-tight",
                  matched && correctPairs.length > 0
                    ? isRightCorrect(i)
                      ? "border-[var(--color-success)] bg-[var(--color-success)]/20 text-[var(--color-text-primary)]"
                      : "border-[var(--color-error-heart)] bg-[var(--color-error-heart)]/15 text-[var(--color-text-primary)]"
                    : matched
                    ? "border-[var(--color-accent-light)] bg-[var(--color-accent-light)]/15 text-[var(--color-text-primary)]"
                    : selectedLeft !== null
                    ? "border-white/40 bg-[var(--color-bg-card-inner)] text-[var(--color-text-primary)] cursor-pointer hover:border-white/70"
                    : "border-[var(--color-gray-border)] bg-[var(--color-bg-card-inner)] text-[var(--color-text-secondary)]",
                  disabled ? "cursor-not-allowed" : "",
                ].join(" ")}
              >
                {right}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
