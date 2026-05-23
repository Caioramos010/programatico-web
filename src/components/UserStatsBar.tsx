import { Heart } from "lucide-react";
import { Xp, FireOn, FireOff } from "./icons";
import type { UserStatsResponse } from "../services/learnService";

interface Props {
  stats: UserStatsResponse | null;
}

interface StatItemProps {
  icon: React.ReactNode;
  value: string;
}

function StatItem({ icon, value }: StatItemProps) {
  return (
    <div className="flex items-center gap-2 font-fredoka font-semibold text-base text-[var(--color-text-primary)]">
      {icon}
      <span>{value}</span>
    </div>
  );
}

export default function UserStatsBar({ stats }: Props) {
  const vidas = stats?.vidasAtuais ?? 5;
  const xp = stats?.totalXp ?? 0;
  const sequencia = stats?.sequenciaAtual ?? 0;

  return (
    <div className="w-full flex justify-center pb-5 pt-3 px-4">
      <div className="flex items-center gap-8 rounded-2xl border border-[var(--color-gray-border)] bg-[var(--color-bg-card)] px-10 py-3">
        <StatItem
          icon={<Heart size={22} className="text-[var(--color-error-heart)] fill-[var(--color-error-heart)] sm:w-[30px] sm:h-[30px]" />}
          value={`${vidas}/5`}
        />
        <StatItem
          icon={sequencia > 0
            ? <FireOn className="w-6 h-6 sm:w-8 sm:h-8" />
            : <FireOff className="w-6 h-6 sm:w-8 sm:h-8" />
          }
          value={String(sequencia)}
        />
        <StatItem
          icon={<Xp className="w-6 h-6 sm:w-8 sm:h-8" />}
          value={`${xp.toLocaleString("pt-BR")} XP`}
        />
      </div>
    </div>
  );
}
