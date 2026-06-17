import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

interface LivesCountdown {
  lives: number;
  secondsLeft: number | null;
}

function useLivesCountdown(
  initialLives: number,
  secondsUntilNextLife: number | null,
  secondsPerLife: number,
  maxLives: number,
): LivesCountdown {
  const [state, setState] = useState<LivesCountdown>({
    lives: initialLives,
    secondsLeft: secondsUntilNextLife != null ? Math.ceil(secondsUntilNextLife) : null,
  });

  useEffect(() => {
    if (secondsUntilNextLife == null) return;
    let proximaVidaEm: number | null = Date.now() + secondsUntilNextLife * 1000;
    let vidas = initialLives;
    const id = setInterval(() => {
      // Recarrega vidas localmente enquanto a página fica aberta, sem refetch.
      while (proximaVidaEm != null && Date.now() >= proximaVidaEm) {
        vidas = Math.min(maxLives, vidas + 1);
        proximaVidaEm = vidas >= maxLives ? null : proximaVidaEm + secondsPerLife * 1000;
      }
      if (proximaVidaEm == null) {
        clearInterval(id);
        setState({ lives: vidas, secondsLeft: null });
      } else {
        setState({ lives: vidas, secondsLeft: Math.ceil((proximaVidaEm - Date.now()) / 1000) });
      }
    }, 1000);
    return () => clearInterval(id);
  }, [initialLives, secondsUntilNextLife, secondsPerLife, maxLives]);

  return state;
}

function LivesStat({ stats }: Props) {
  const navigate = useNavigate();
  const maxLives = stats?.maxLives ?? 5;
  const unlimited = stats?.unlimitedLives ?? false;

  const { lives, secondsLeft } = useLivesCountdown(
    stats?.currentLives ?? 5,
    unlimited ? null : (stats?.secondsUntilNextLife ?? null),
    stats?.secondsPerLife ?? 1800,
    maxLives,
  );

  const tooltipTitle = unlimited
    ? "Vidas infinitas"
    : secondsLeft != null
      ? `Próxima vida em ${formatCountdown(secondsLeft)}`
      : "Vidas cheias!";

  const tooltipHint = unlimited
    ? "Você é Root — aproveite!"
    : "Vire Root e tenha vidas infinitas";

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => navigate("/seja-root")}
        aria-label={`${tooltipTitle}. ${tooltipHint}`}
        className="cursor-pointer"
      >
        <StatItem
          icon={<Heart size={22} className="text-[var(--color-error-heart)] fill-[var(--color-error-heart)] sm:w-[30px] sm:h-[30px]" />}
          value={unlimited ? "∞" : `${lives}/${maxLives}`}
        />
      </button>
      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-xl bg-zinc-900/95 px-3 py-2 text-center shadow-lg group-hover:block group-focus-within:block"
      >
        <p className="font-fredoka text-sm font-semibold text-white">{tooltipTitle}</p>
        <p className="font-fredoka text-xs text-white/70">{tooltipHint}</p>
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900/95" aria-hidden />
      </div>
    </div>
  );
}

export default function UserStatsBar({ stats }: Props) {
  const xp = stats?.totalXp ?? 0;
  const streak = stats?.currentStreak ?? 0;

  return (
    <div className="w-full flex justify-center pb-5 pt-3 px-4">
      <div className="flex items-center gap-8 rounded-2xl border border-[var(--color-gray-border)] bg-[var(--color-bg-card)] px-10 py-3">
        <LivesStat
          key={stats ? `${stats.currentLives}:${stats.secondsUntilNextLife}` : "loading"}
          stats={stats}
        />
        <StatItem
          icon={streak > 0
            ? <FireOn className="w-6 h-6 sm:w-8 sm:h-8" />
            : <FireOff className="w-6 h-6 sm:w-8 sm:h-8" />
          }
          value={String(streak)}
        />
        <StatItem
          icon={<Xp className="w-6 h-6 sm:w-8 sm:h-8" />}
          value={`${xp.toLocaleString("pt-BR")} XP`}
        />
      </div>
    </div>
  );
}
