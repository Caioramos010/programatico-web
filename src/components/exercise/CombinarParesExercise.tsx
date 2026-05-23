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

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [pairs, setPairs] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    setSelectedLeft(null);
    setPairs(new Map());
    onAnswer("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayData]);

  function handleLeftClick(left: string) {
    // Already paired items cannot be undone
    if (disabled || pairs.has(left)) return;
    setSelectedLeft(left === selectedLeft ? null : left);
  }

  function handleRightClick(right: string) {
    // Already used right cannot be reassigned
    if (disabled || selectedLeft === null || usedRights.has(right)) return;
    const newPairs = new Map(pairs);
    newPairs.set(selectedLeft, right);
    setPairs(newPairs);
    setSelectedLeft(null);
    // Send all pairs formed so far (partial or complete)
    const answer = Array.from(newPairs.entries()).map(([l, r]) => ({ left: l, right: r }));
    onAnswer(JSON.stringify(answer));
  }

  const usedRights = new Set(pairs.values());

  const correctPairs: CorrectPair[] = (() => {
    if (!correctAnswer) return [];
    try { return JSON.parse(correctAnswer) as CorrectPair[]; } catch { return []; }
  })();

  function isPairCorrect(left: string): boolean {
    const chosenRight = pairs.get(left);
    if (!chosenRight) return false;
    return correctPairs.some(
      (p) => p.left.toLowerCase() === left.toLowerCase() && p.right.toLowerCase() === chosenRight.toLowerCase()
    );
  }

  function isRightCorrect(right: string): boolean {
    let leftPaired: string | undefined;
    pairs.forEach((v, k) => { if (v === right) leftPaired = k; });
    if (!leftPaired) return false;
    return correctPairs.some(
      (p) => p.left.toLowerCase() === leftPaired!.toLowerCase() && p.right.toLowerCase() === right.toLowerCase()
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 w-full">
        {/* Coluna esquerda — conceitos */}
        <div className="flex flex-col gap-2">
          {data.lefts.map((left) => {
            const matched = pairs.has(left);
            const active = selectedLeft === left;
            return (
              <button
                key={`left-${left}`}
                type="button"
                disabled={disabled}
                onClick={() => handleLeftClick(left)}
                className={[
                  "px-3 py-3 rounded-2xl border-2 font-fredoka font-semibold text-base text-center transition-all duration-150 min-h-[52px] leading-tight",
                  matched && correctPairs.length > 0
                    ? isPairCorrect(left)
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
          {data.rights.map((right) => {
            const matched = usedRights.has(right);
            return (
              <button
                key={`right-${right}`}
                type="button"
                disabled={disabled}
                onClick={() => handleRightClick(right)}
                className={[
                  "px-3 py-3 rounded-2xl border-2 font-fredoka text-base text-center transition-all duration-150 min-h-[52px] leading-tight",
                  matched && correctPairs.length > 0
                    ? isRightCorrect(right)
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
