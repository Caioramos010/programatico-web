import { Zap } from "lucide-react";
import BookOne from "./icons/BookOne";
import type { ModuloComProgresso } from "../services/learnService";

interface Props {
  modulo: ModuloComProgresso;
  nodeSize?: number;
  onClick?: () => void;
}

const MODULE_GRADIENT = "linear-gradient(135deg, #11604D 0%, #363F58 100%)";

const statusConfig = {
  COMPLETED: {
    ring: "border-[var(--color-accent-light)]",
    glow: "shadow-[0_0_24px_var(--color-accent-light)]",
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

export default function ModuleNode({ modulo, nodeSize = 96, onClick }: Props) {
  const cfg = statusConfig[modulo.status];
  const isActivity = modulo.tipo === "ACTIVITY";
  const isClickable = modulo.status !== "LOCKED";

  const shape = isActivity ? "rounded-full" : "rounded-2xl";
  const iconPx = Math.round(nodeSize * 0.42);

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        disabled={!isClickable}
        onClick={isClickable ? onClick : undefined}
        aria-label={`${modulo.titulo} — ${modulo.status}`}
        style={{ background: cfg.gradient, width: nodeSize, height: nodeSize }}
        className={[
          "flex items-center justify-center border-4 transition-all duration-200",
          shape,
          cfg.ring,
          cfg.glow,
          cfg.opacity,
          isClickable ? "cursor-pointer hover:scale-105 active:scale-95" : "cursor-not-allowed",
        ].join(" ")}
      >
        {isActivity ? (
          <Zap style={{ width: iconPx, height: iconPx }} className={cfg.icon} strokeWidth={2.5} />
        ) : (
          <BookOne style={{ width: iconPx, height: iconPx }} className={cfg.icon} />
        )}
      </button>
    </div>
  );
}
