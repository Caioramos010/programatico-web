import { Skeleton } from "./Skeleton";
import { RefreshCw } from "lucide-react";
import type { TrackResponse } from "../services/learnService";

interface Props {
  track: TrackResponse | null;
  loading?: boolean;
}

export default function TrackBar({ track, loading }: Props) {
  if (loading || !track) {
    return (
      <div className="w-full flex justify-center pt-4 pb-2 px-4">
        <div className="w-full max-w-2xl flex items-center gap-3 rounded-2xl border border-[var(--color-gray-border)] bg-[var(--color-bg-card)] px-5 py-3">
          <Skeleton className="w-9 h-9 rounded-full shrink-0" />
          <div className="flex-1 flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-48 rounded" />
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
          <Skeleton className="w-4 h-4 rounded shrink-0" />
          <Skeleton className="h-3.5 w-8 rounded shrink-0" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center pt-4 pb-2 px-4">
      <div className="w-full max-w-2xl flex items-center gap-3 rounded-2xl border border-[var(--color-gray-border)] bg-[var(--color-bg-card)] px-5 py-3">
        {/* Track icon */}
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-[var(--color-bg-card-inner)] border border-[var(--color-gray-border)] overflow-hidden">
          {track.icon ? (
            <img src={track.icon} alt={track.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-base text-[var(--color-text-muted)] font-bold leading-none select-none">
              {track.title.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Name + progress bar */}
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          {/* Row 1: title + refresh icon */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-fredoka font-semibold text-white text-base truncate leading-none">
              {track.title}
            </span>
            <RefreshCw
              size={13}
              className="shrink-0 text-[var(--color-text-muted)] cursor-pointer hover:text-white transition-colors"
            />
          </div>
          {/* Row 2: % text + progress bar + count */}
          <div className="flex items-center gap-2">
            <span className="text-base text-[var(--color-text-muted)] font-fredoka shrink-0">
              {track.completedPercentage}% completo
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-[var(--color-bg-card-inner)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${track.completedPercentage}%`,
                  background: "linear-gradient(90deg, #11604D 0%, #178a6e 100%)",
                }}
              />
            </div>
            <span className="text-base text-[var(--color-text-muted)] font-fredoka tabular-nums shrink-0">
              {track.completedModules}/{track.totalModules}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
