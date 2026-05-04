import { useMemo, useEffect, useRef, useState } from "react";
import { Zap, BookOpen } from "lucide-react";
import type { ModuloComProgresso } from "../services/learnService";
import ModuleNode from "./ModuleNode";
import ConnectorLine from "./ConnectorLine";

interface Props {
  modulos: ModuloComProgresso[];
  onModuloClick?: (modulo: ModuloComProgresso) => void;
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

export default function TrackMap({ modulos, onModuloClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(640);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

  if (modulos.length === 0) {
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

  const totalRows = Math.ceil(modulos.length / 2);
  const containerH = totalRows * rowH + padTop + nodeR * 2 + 40;

  const connections = useMemo(() => {
    return modulos.slice(1).map((mod, i) => {
      const active = modulos[i].status !== "LOCKED";
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
      const srcMod = modulos[i];
      const srcBoundary = srcMod.tipo === "ACTIVITY"
        ? nodeR
        : nodeR / Math.max(Math.abs(Math.cos(angleRad)), Math.abs(Math.sin(angleRad)));
      const dstBoundary = mod.tipo === "ACTIVITY"
        ? nodeR
        : nodeR / Math.max(Math.abs(Math.cos(angleRad)), Math.abs(Math.sin(angleRad)));
      return { key: mod.id, cx1, cy1, dist, srcBoundary, dstBoundary, angle, active };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modulos, containerW]);

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

        {modulos.map((modulo, i) => {
          const cx = getX(i);
          const cy = getY(i);
          const isSelected = selectedIndex === i;

          // Popover position: prefer right side, fallback to left when near right edge
          const popoverLeft = cx + nodeR + 12;
          const popoverRight = containerW - (cx - nodeR - 12);
          const showRight = popoverLeft + 180 <= containerW;

          return (
            <div key={modulo.id}>
              <div
                className="absolute"
                style={{ left: cx - nodeR, top: cy - nodeR, width: nodeR * 2, zIndex: 2 }}
              >
<ModuleNode
                  modulo={modulo}
                  nodeSize={nodeR * 2}
                  onClick={() => setSelectedIndex(isSelected ? null : i)}
                />
              </div>

              {isSelected && (
                <div
                  className="absolute z-10 w-44 rounded-xl border border-[var(--color-gray-border)] bg-[var(--color-bg-card)] p-3 shadow-lg"
                  style={
                    showRight
                      ? { left: popoverLeft, top: cy - nodeR }
                      : { right: popoverRight, top: cy - nodeR }
                  }
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-base font-semibold font-fredoka text-[var(--color-text-primary)] leading-tight">
                      {modulo.titulo}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-base font-semibold shrink-0 ${
                        modulo.tipo === "ACTIVITY"
                          ? "bg-yellow-500/15 text-yellow-400"
                          : "bg-blue-500/15 text-blue-400"
                      }`}
                    >
                      {modulo.tipo === "ACTIVITY" ? <Zap size={10} /> : <BookOpen size={10} />}
                      {modulo.tipo === "ACTIVITY" ? "Atividade" : "Teórico"}
                    </span>
                  </div>
                  {modulo.descricao && (
                    <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed mb-3">
                      {modulo.descricao}
                    </p>
                  )}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedIndex(null);
                        onModuloClick?.(modulo);
                      }}
                      className="rounded-lg bg-[var(--color-bg-card-inner)] hover:bg-[var(--color-gray-border)] transition-colors px-3 py-1 text-base font-semibold font-fredoka text-[var(--color-text-secondary)]"
                    >
                      {modulo.status === "COMPLETED" ? "REVER" : `COMEÇAR${modulo.totalXp > 0 ? ` +${modulo.totalXp}XP` : ""}`}
                    </button>
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
