import Hot from "../mascot/Hot";

const DAYS = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"];

interface Props {
  streak: number;
  onContinue: () => void;
}

export default function WeekStreakScreen({ streak, onContinue }: Props) {
  const weeks = Math.floor(streak / 7);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-bg-primary)]/95 backdrop-blur-sm px-6">
      <div className="flex flex-col items-center text-center gap-6 max-w-md w-full">
        <Hot className="w-40 h-40 object-contain drop-shadow-[0_0_36px_rgba(249,115,22,0.55)]" />

        <div className="flex flex-col gap-1">
          <span className="font-fredoka text-6xl font-bold text-orange-400">{streak}</span>
          <span className="font-fredoka text-lg text-[var(--color-text-secondary)]">dias de ofensiva</span>
        </div>

        <h2 className="font-fredoka text-2xl font-bold text-[var(--color-text-primary)]">
          Continue assim!
        </h2>
        <p className="font-fredoka text-base text-[var(--color-text-secondary)]">
          {weeks <= 1
            ? "Você acaba de conquistar uma weekstreak!"
            : `Você já tem ${weeks} semanas seguidas de ofensiva!`}
        </p>

        <div className="flex gap-2 justify-center w-full">
          {DAYS.map((d) => (
            <div key={d} className="flex flex-col items-center gap-1.5">
              <div className="w-9 h-9 rounded-full bg-orange-500/90 flex items-center justify-center text-base shadow-[0_0_12px_rgba(249,115,22,0.4)]">
                🔥
              </div>
              <span className="font-fredoka text-xs text-[var(--color-text-muted)]">{d}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="w-full mt-2 py-4 rounded-2xl font-fredoka font-semibold text-base tracking-wide bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98] transition-all cursor-pointer"
        >
          CONTINUAR
        </button>
      </div>
    </div>
  );
}
