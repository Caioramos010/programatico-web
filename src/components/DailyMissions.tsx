import { Zap } from "lucide-react";
import { Book, Xp } from "./icons";
import type { MissaoResponse } from "../services/learnService";

interface Props {
  missoes: MissaoResponse[];
  loading?: boolean;
}

function getMissionIcon(tipo: string) {
  const t = tipo?.toUpperCase() ?? "";
  if (t.includes("TEORICA") || t.includes("STUDY")) {
    return <Book className="w-5 h-5 shrink-0" />;
  }
  return <Zap size={20} className="shrink-0" strokeWidth={2.5} />;
}

function MissionItem({ missao }: { missao: MissaoResponse }) {
  return (
    <div className="flex flex-col gap-1.5">
      {/* Title row: icon + name | XP */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[var(--color-text-secondary)] min-w-0">
          {getMissionIcon(missao.tipo)}
          <span className="text-sm font-fredoka font-medium truncate">{missao.titulo}</span>
        </div>
        <div className="flex items-center gap-0.5 text-sm font-fredoka shrink-0">
          <Xp className="w-3.5 h-3.5" />
          <span className="text-[var(--color-premium)]">+{missao.recompensaXp}XP</span>
        </div>
      </div>

      {/* Progress row */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-[var(--color-bg-card-inner)] overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-300"
            style={{ width: `${Math.min(missao.progressoAtual / missao.meta, 1) * 100}%` }}
          />
        </div>
        <span className="text-sm text-[var(--color-text-muted)] font-fredoka shrink-0 tabular-nums">
          {missao.progressoAtual}/{missao.meta}
        </span>
      </div>
    </div>
  );
}

export default function DailyMissions({ missoes, loading }: Props) {
  return (
    <aside className="w-64 xl:w-72 shrink-0 px-4 py-4">
      <div className="rounded-2xl border border-[var(--color-gray-border)] bg-[var(--color-bg-card)] p-5 flex flex-col gap-5">
        <h2 className="font-fredoka font-semibold text-base text-[var(--color-text-primary)] tracking-wide">
          Missões Diárias
        </h2>

        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex flex-col gap-2">
                <div className="h-4 w-full rounded bg-[var(--color-bg-card-inner)] animate-pulse" />
                <div className="h-2 w-full rounded-full bg-[var(--color-bg-card-inner)] animate-pulse" />
              </div>
            ))}
          </div>
        ) : missoes.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)] font-fredoka">
            Sem missões disponíveis.
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            {missoes.map((m) => (
              <MissionItem key={m.missionId} missao={m} />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
