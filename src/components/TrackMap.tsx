import { useMemo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, BookOpen, X } from "lucide-react";
import type { ModuleWithProgress } from "../services/learnService";
import { useAuthStore } from "../stores/authStore";
import { isActiveRoot } from "../lib/subscription";
import ModuleNode from "./ModuleNode";
import ConnectorLine from "./ConnectorLine";

interface Props {
  modules: ModuleWithProgress[];
  onModuleClick?: (module: ModuleWithProgress) => void;
}

const CONN_H = 44;

function computeLayout(w: number) {
  const nodeR = Math.round(Math.max(36, Math.min(60, w * 0.13)));
  const leftCx = Math.round(w * 0.25);
  const rightCx = Math.round(w * 0.75);
  const rowH = nodeR * 4;
  const padTop = Math.round(nodeR * 2);
  return { nodeR, leftCx, rightCx, rowH, padTop };
}

export default function TrackMap({ modules, onModuleClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(640);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const isRoot = isActiveRoot(useAuthStore((s) => s.user));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerW(el.offsetWidth);
    const ro = new ResizeObserver(([entry]) => {
      setContainerW(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Close popover on outside click
  useEffect(() => {
    if (selectedIndex === null) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSelectedIndex(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [selectedIndex]);

  if (modules.length === 0) {
    return (
      <div ref={containerRef} className="flex flex-1 flex-col items-center justify-center py-24 text-center px-6 w-full">
        <p className="text-[var(--color-text-muted)] font-fredoka text-base">
          Nenhum módulo cadastrado nesta trilha ainda.
        </p>
      </div>
    );
  }

  const { nodeR, leftCx, rightCx, rowH, padTop } = computeLayout(containerW);

  // Serpentine layout: even rows go left→right, odd rows go right→left.
  // Within-row connectors are horizontal; between-row connectors are vertical (same X).
  function getX(i: number) {
    const row = Math.floor(i / 2);
    const posInRow = i % 2;
    return (row % 2 === 0)
      ? (posInRow === 0 ? leftCx : rightCx)
      : (posInRow === 0 ? rightCx : leftCx);
  }
  function getY(i: number) { return Math.floor(i / 2) * rowH + padTop; }

  const totalRows = Math.ceil(modules.length / 2);
  const containerH = totalRows * rowH + padTop + nodeR * 2 + 40;

  const connections = useMemo(() => {
    return modules.slice(1).map((mod, i) => {
      const active = modules[i].status !== "LOCKED";
      const cx1 = getX(i);
      const cy1 = getY(i);
      const cx2 = getX(i + 1);
      const cy2 = getY(i + 1);
      const dx = cx2 - cx1;
      const dy = cy2 - cy1;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angleRad = Math.atan2(dy, dx);
      const angle = angleRad * 180 / Math.PI;
      // For circles (ACTIVITY): boundary is nodeR in all directions.
      // For squares (STUDY): boundary in a given direction = nodeR / max(|cosθ|, |sinθ|).
      // This ensures the arrowhead lands exactly at the node's visible edge, not inside it.
      const srcMod = modules[i];
      const srcBoundary = srcMod.type === "ACTIVITY"
        ? nodeR
        : nodeR / Math.max(Math.abs(Math.cos(angleRad)), Math.abs(Math.sin(angleRad)));
      const dstBoundary = mod.type === "ACTIVITY"
        ? nodeR
        : nodeR / Math.max(Math.abs(Math.cos(angleRad)), Math.abs(Math.sin(angleRad)));
      return { key: mod.id, cx1, cy1, dist, srcBoundary, dstBoundary, angle, active };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modules, containerW]);

  return (
    <div className="flex flex-1 w-full py-8 justify-center px-4">
      <div ref={containerRef} className="relative w-full max-w-2xl" style={{ height: containerH }}>

        {connections.map(({ key, cx1, cy1, dist, srcBoundary, dstBoundary, angle, active }) => (
          <div
            key={`conn-${key}`}
            className="absolute pointer-events-none"
            style={{
              left: cx1 + srcBoundary * Math.cos(angle * Math.PI / 180),
              top: cy1 + srcBoundary * Math.sin(angle * Math.PI / 180) - CONN_H / 2,
              width: dist - srcBoundary - dstBoundary,
              height: CONN_H,
              transform: `rotate(${angle}deg)`,
              transformOrigin: "0 50%",
              zIndex: 0,
            }}
          >
            <ConnectorLine active={active} />
          </div>
        ))}

        {selectedIndex !== null && (
          <div
            className="fixed inset-0 z-40 bg-black/40 sm:bg-transparent"
            onClick={() => setSelectedIndex(null)}
            aria-hidden
          />
        )}

        {modules.map((module, i) => {
          const cx = getX(i);
          const cy = getY(i);
          const isSelected = selectedIndex === i;
          const isNarrow = containerW < 640;

          // Popover: prefer right of node, then left; if it fits on neither side
          // (narrow/mobile screens) clamp it inside the container so it never
          // runs off-screen.
          const popMargin = 12;
          const popWidth = Math.min(256, containerW - popMargin * 2);
          let popoverX = cx + nodeR + popMargin;
          if (popoverX + popWidth > containerW - popMargin) {
            const leftCandidate = cx - nodeR - popMargin - popWidth;
            popoverX = leftCandidate >= popMargin ? leftCandidate : cx - popWidth / 2;
          }
          popoverX = Math.max(popMargin, Math.min(popoverX, containerW - popWidth - popMargin));

          return (
            <div key={module.id}>
              <div
                className="absolute"
                style={{ left: cx - nodeR, top: cy - nodeR, width: nodeR * 2, zIndex: 2 }}
              >
<ModuleNode
                  module={module}
                  nodeSize={nodeR * 2}
                  onClick={() => setSelectedIndex(isSelected ? null : i)}
                />
              </div>

              {isSelected && (
                <div
                  className={[
                    "z-50 rounded-xl border border-[var(--color-gray-border)] bg-[var(--color-bg-card)] p-3 shadow-lg",
                    isNarrow
                      ? "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-sm"
                      : "absolute",
                  ].join(" ")}
                  style={isNarrow ? undefined : { left: popoverX, top: cy - nodeR, width: popWidth }}
                >
                  <button
                    type="button"
                    aria-label="Fechar"
                    onClick={() => setSelectedIndex(null)}
                    className="absolute right-2 top-2 z-10 p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    <X size={18} />
                  </button>
                  <div className="flex flex-col gap-2 mb-2 pr-6">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold shrink-0 ${
                          module.type === "ACTIVITY"
                            ? "bg-yellow-500/15 text-yellow-400"
                            : "bg-blue-500/15 text-blue-400"
                        }`}
                      >
                        {module.type === "ACTIVITY" ? <Zap size={10} /> : <BookOpen size={10} />}
                        {module.type === "ACTIVITY" ? "Atividade" : "Teórico"}
                      </span>
                      {module.status === "LOCKED" && (
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold shrink-0 bg-[var(--color-bg-card-inner)] text-[var(--color-text-muted)]">
                          Bloqueado
                        </span>
                      )}
                    </div>
                    <p className="text-base font-semibold font-fredoka text-[var(--color-text-primary)] leading-tight break-words">
                      {module.title}
                    </p>
                  </div>
                  {module.description && (
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3 break-words">
                      {module.description}
                    </p>
                  )}
                  {module.topAssuntos && module.topAssuntos.length > 0 ? (
                    <div className="mb-3">
                      <p className="text-xs text-[var(--color-text-muted)] mb-1">Assuntos principais</p>
                      <div className="flex flex-wrap gap-1.5">
                        {module.topAssuntos.map((assunto) => (
                          <span
                            key={assunto}
                            className="rounded-full bg-[var(--color-bg-card-inner)] px-2 py-0.5 text-xs font-medium text-[var(--color-premium)]"
                          >
                            {assunto}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : !isRoot ? (
                    <button
                      type="button"
                      onClick={() => navigate("/seja-root")}
                      className="mb-3 w-full text-left rounded-lg border border-[var(--color-premium-dark)] bg-[var(--color-bg-card-inner)] px-3 py-2 text-xs font-medium text-[var(--color-premium)] hover:opacity-80 transition-opacity"
                    >
                      Seja Root para ver os assuntos deste módulo →
                    </button>
                  ) : null}
                  <div className="flex justify-end">
                    {module.status === "LOCKED" ? (
                      <span className="text-xs font-fredoka text-[var(--color-text-muted)] italic">
                        Conclua os módulos anteriores
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedIndex(null);
                          onModuleClick?.(module);
                        }}
                        className="rounded-lg bg-[var(--color-bg-card-inner)] hover:bg-[var(--color-gray-border)] transition-colors px-3 py-1 text-sm font-semibold font-fredoka text-[var(--color-text-secondary)]"
                      >
                        {module.status === "COMPLETED"
                          ? "REVER"
                          : module.emAndamento
                          ? "CONTINUAR"
                          : `COMEÇAR${module.totalXp > 0 ? ` +${module.totalXp}XP` : ""}`}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
