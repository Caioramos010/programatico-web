import { Zap } from "lucide-react";
import { Book, Xp } from "./icons";
import type { MissionResponse } from "../services/learnService";

interface Props {
  missions: MissionResponse[];
  loading?: boolean;
}

function getMissionIcon(type: string) {
  const t = type?.toUpperCase() ?? "";
  if (t.includes("READ_PAGES")) return <Book className="w-5 h-5 shrink-0" />;
  if (t.includes("EARN_XP")) return <Xp className="w-5 h-5 shrink-0" />;
  return <Zap size={20} className="shrink-0" strokeWidth={2.5} />;
}

function MissionItem({ mission }: { mission: MissionResponse }) {
  const done = mission.completed;
  const pct = Math.min(mission.currentProgress / mission.goal, 1) * 100;
  return (
    <div className="flex flex-col gap-1.5">
      {/* Title row: icon + name | XP */}
      <div className="flex items-center justify-between gap-2">
        <div
          className="flex items-center gap-2 min-w-0"
          style={{ color: done ? "var(--color-success)" : "var(--color-text-secondary)" }}
        >
          {getMissionIcon(mission.type)}
          <span className="text-base font-fredoka font-medium leading-snug">{mission.title}</span>
        </div>
        <div className="flex items-center gap-0.5 text-base font-fredoka shrink-0">
          <Xp className="w-3.5 h-3.5" />
          <span className="text-[var(--color-premium)]">+{mission.xpReward}XP</span>
        </div>
      </div>

      {/* Progress row */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-[var(--color-bg-card-inner)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${pct}%`, background: done ? "var(--color-success)" : "var(--color-accent)" }}
          />
        </div>
        <span
          className="text-base font-fredoka shrink-0 tabular-nums"
          style={{ color: done ? "var(--color-success)" : "var(--color-text-muted)" }}
        >
          {mission.currentProgress}/{mission.goal}
        </span>
      </div>
    </div>
  );
}

export default function DailyMissions({ missions, loading }: Props) {
  return (
    <aside className="w-full lg:w-64 xl:w-72 shrink-0 px-4 py-4">
      <div className="rounded-2xl border border-[var(--color-gray-border)] bg-[var(--color-bg-card)] p-5 flex flex-col gap-5">
        <h2 className="font-fredoka font-semibold text-lg text-[var(--color-text-primary)] tracking-wide">
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
        ) : missions.length === 0 ? (
          <p className="text-base text-[var(--color-text-muted)] font-fredoka">
            Sem missões disponíveis.
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            {missions.map((m) => (
              <MissionItem key={m.missionId} mission={m} />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
