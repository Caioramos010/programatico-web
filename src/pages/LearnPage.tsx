import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { learnService } from "../services/learnService";
import type { TrilhaResponse, UserStatsResponse, MissaoResponse, ModuloComProgresso } from "../services/learnService";
import { parseApiError } from "../utils/parseApiError";
import TrackBar from "../components/TrackBar";
import TrackMap from "../components/TrackMap";
import DailyMissions from "../components/DailyMissions";
import UserStatsBar from "../components/UserStatsBar";

export default function LearnPage() {
  const navigate = useNavigate();
  const [trilha, setTrilha] = useState<TrilhaResponse | null>(null);
  const [stats, setStats] = useState<UserStatsResponse | null>(null);
  const [missoes, setMissoes] = useState<MissaoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Drag-to-scroll
  const mapRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ dragging: false, startY: 0, scrollTop: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = mapRef.current;
    if (!el) return;
    dragState.current = { dragging: true, startY: e.clientY, scrollTop: el.scrollTop };
    el.style.cursor = "grabbing";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.current.dragging) return;
    const el = mapRef.current;
    if (!el) return;
    e.preventDefault();
    el.scrollTop = dragState.current.scrollTop - (e.clientY - dragState.current.startY);
  }, []);

  const stopDrag = useCallback(() => {
    dragState.current.dragging = false;
    if (mapRef.current) mapRef.current.style.cursor = "auto";
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function carregar() {
      setLoading(true);
      setFormError(null);
      try {
        const [trilhaData, statsData, missoesData] = await Promise.all([
          learnService.getTrilha(),
          learnService.getStats(),
          learnService.getMissoes(),
        ]);
        if (cancelled) return;
        setTrilha(trilhaData);
        setStats(statsData);
        setMissoes(missoesData);
      } catch (err) {
        if (cancelled) return;
        const { formError: msg } = parseApiError(err);
        setFormError(msg ?? "Erro ao carregar a trilha.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    carregar();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleModuloClick(modulo: ModuloComProgresso) {
    if (modulo.tipo === "ACTIVITY") {
      navigate(`/modulos/${modulo.id}/exercicio`);
    }
  }

  return (
    <div className="bg-[var(--color-bg-primary)]" style={{ height: "100dvh" }}>

      {/* ── TrackBar: fixed top ── */}
      <div className="fixed top-0 left-0 right-0 z-30 md:left-60 lg:right-64 xl:right-72">
        <TrackBar trilha={trilha} loading={loading} />
      </div>

      {/* ── DailyMissions: fixed right (desktop only) ── */}
      <div className="hidden lg:flex fixed top-0 right-0 z-30 h-full items-center">
        <DailyMissions missoes={missoes} loading={loading} />
      </div>

      {/* ── UserStatsBar: fixed bottom ── */}
      <div className="fixed bottom-14 left-0 right-0 z-30 md:bottom-0 md:left-60 lg:right-64 xl:right-72">
        <UserStatsBar stats={stats} />
      </div>

      {/* ── TrackMap: scrollable area between fixed bars ── */}
      <div
        ref={mapRef}
        className="absolute left-0 right-0 overflow-y-auto no-scrollbar md:left-60 lg:right-64 xl:right-72 select-none"
        style={{
          top: 76,
          bottom: 76,
          scrollbarWidth: "none",        /* Firefox */
          msOverflowStyle: "none",       /* IE/Edge */
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        {formError ? (
          <div className="flex items-center justify-center py-24 px-6">
            <p className="text-[var(--color-error-heart)] font-fredoka text-base text-center">
              {formError}
            </p>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-12 px-4">
            <div className="flex flex-col items-center gap-6 w-full max-w-sm">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="w-[72px] h-[72px] rounded-full bg-[var(--color-bg-card-inner)] animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : !trilha || trilha.modulos.length === 0 ? (
          <div className="flex items-center justify-center py-24 px-6">
            <div className="flex flex-col items-center gap-3 max-w-sm text-center font-fredoka">
              <p className="text-base font-semibold text-[var(--color-text-primary)]">
                Nenhuma trilha disponível
              </p>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Ainda não há módulos publicados para o seu nível. Volte em breve — novos conteúdos estão a caminho!
              </p>
            </div>
          </div>
        ) : (
          <TrackMap
            modulos={trilha.modulos}
            onModuloClick={handleModuloClick}
          />
        )}
      </div>
    </div>
  );
}
