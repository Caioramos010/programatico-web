import { RefreshCw } from "lucide-react";
import type { TrilhaResponse } from "../services/learnService";

interface Props {
  trilha: TrilhaResponse | null;
  loading?: boolean;
}

export default function TrackBar({ trilha, loading }: Props) {
  if (loading || !trilha) {
    return (
      <div className="w-full flex justify-center pt-4 pb-2 px-4">
        <div className="w-full max-w-2xl flex items-center gap-3 rounded-2xl border border-[var(--color-gray-border)] bg-[var(--color-bg-card)] px-5 py-3">
          <div className="w-9 h-9 rounded-full bg-[var(--color-bg-card-inner)] animate-pulse shrink-0" />
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="h-3.5 w-48 rounded bg-[var(--color-bg-card-inner)] animate-pulse" />
            <div className="h-1.5 w-full rounded-full bg-[var(--color-bg-card-inner)] animate-pulse" />
          </div>
          <div className="w-4 h-4 rounded bg-[var(--color-bg-card-inner)] animate-pulse shrink-0" />
          <div className="h-3.5 w-8 rounded bg-[var(--color-bg-card-inner)] animate-pulse shrink-0" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center pt-4 pb-2 px-4">
      <div className="w-full max-w-2xl flex items-center gap-3 rounded-2xl border border-[var(--color-gray-border)] bg-[var(--color-bg-card)] px-5 py-3">
        {/* Track icon */}
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-[var(--color-bg-card-inner)] border border-[var(--color-gray-border)] overflow-hidden">
          {trilha.icon ? (
            <img src={trilha.icon} alt={trilha.titulo} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm text-[var(--color-text-muted)] font-bold leading-none select-none">
              {trilha.titulo.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Name + progress bar */}
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          {/* Row 1: title + refresh icon */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-fredoka font-semibold text-white text-sm truncate leading-none">
              {trilha.titulo}
            </span>
            <RefreshCw
              size={13}
              className="shrink-0 text-[var(--color-text-muted)] cursor-pointer hover:text-white transition-colors"
            />
          </div>
          {/* Row 2: % text + progress bar + count */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--color-text-muted)] font-fredoka shrink-0">
              {trilha.percentualConcluido}% completo
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-[var(--color-bg-card-inner)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${trilha.percentualConcluido}%`,
                  background: "linear-gradient(90deg, #11604D 0%, #178a6e 100%)",
                }}
              />
            </div>
            <span className="text-xs text-[var(--color-text-muted)] font-fredoka tabular-nums shrink-0">
              {trilha.concluidosModulos}/{trilha.totalModulos}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
