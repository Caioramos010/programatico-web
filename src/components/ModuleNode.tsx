import { Zap, CheckCircle2 } from "lucide-react";
import BookOne from "./icons/BookOne";
import type { ModuleWithProgress } from "../services/learnService";

interface Props {
  module: ModuleWithProgress;
  nodeSize?: number;
  onClick?: () => void;
}

const MODULE_GRADIENT = "linear-gradient(135deg, #11604D 0%, #363F58 100%)";

const statusConfig = {
  COMPLETED: {
    ring: "border-[var(--color-accent-light)]",
    glow: "",
    icon: "text-white",
    opacity: "",
    gradient: MODULE_GRADIENT,
  },
  UNLOCKED: {
    ring: "border-white/50",
    glow: "shadow-[0_0_16px_#11604D]",
    icon: "text-white",
    opacity: "",
    gradient: MODULE_GRADIENT,
  },
  LOCKED: {
    ring: "border-[var(--color-gray-border)]",
    glow: "",
    icon: "text-[var(--color-text-muted)]",
    opacity: "opacity-30",
    gradient: "var(--color-bg-card)",
  },
} as const;

export default function ModuleNode({ module, nodeSize = 96, onClick }: Props) {
  const cfg = statusConfig[module.status];
  const isActivity = module.type === "ACTIVITY";
  const isLocked = module.status === "LOCKED";
  const isCompleted = module.status === "COMPLETED";

  const shape = isActivity ? "rounded-full" : "rounded-2xl";
  const iconPx = Math.round(nodeSize * 0.42);
  const badgePx = Math.round(nodeSize * 0.32);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative">
        <button
          type="button"
          onClick={onClick}
          aria-label={`${module.title} — ${module.status}`}
          style={{ background: cfg.gradient, width: nodeSize, height: nodeSize }}
          className={[
            "flex items-center justify-center border-4 transition-all duration-200",
            shape,
            cfg.ring,
            cfg.glow,
            cfg.opacity,
            "cursor-pointer hover:scale-105 active:scale-95",
            isLocked ? "hover:brightness-110" : "",
          ].join(" ")}
        >
          {isActivity ? (
            <Zap style={{ width: iconPx, height: iconPx }} className={cfg.icon} strokeWidth={2.5} />
          ) : (
            <BookOne style={{ width: iconPx, height: iconPx }} className={cfg.icon} />
          )}
        </button>

        {isCompleted && (
          <div
            className="absolute -bottom-1.5 -right-1.5 rounded-full bg-[var(--color-bg-primary)] p-0.5"
          >
            <CheckCircle2
              style={{ width: badgePx, height: badgePx }}
              className="text-[var(--color-accent-light)]"
              strokeWidth={2}
              fill="currentColor"
              color="var(--color-bg-primary)"
            />
          </div>
        )}
      </div>

      {isCompleted && (
        <span className="font-fredoka text-base font-semibold tracking-wide text-[var(--color-accent-light)] uppercase">
          Completo
        </span>
      )}
    </div>
  );
}
