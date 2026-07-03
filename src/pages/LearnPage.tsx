import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Target, X } from "lucide-react";
import { learnService } from "../services/learnService";
import type { TrackResponse, UserStatsResponse, MissionResponse, ModuleWithProgress } from "../services/learnService";
import { parseApiError } from "../utils/parseApiError";
import TrackBar from "../components/TrackBar";
import TrackMap from "../components/TrackMap";
import DailyMissions from "../components/DailyMissions";
import UserStatsBar from "../components/UserStatsBar";
import WeekStreakScreen from "../components/streak/WeekStreakScreen";

export default function LearnPage() {
  const navigate = useNavigate();
  const [track, setTrack] = useState<TrackResponse | null>(null);
  const [stats, setStats] = useState<UserStatsResponse | null>(null);
  const [missions, setMissions] = useState<MissionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [showStreak, setShowStreak] = useState(false);
  const [missionsOpen, setMissionsOpen] = useState(false);

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
        const [trackData, statsData, missionsData] = await Promise.all([
          learnService.getTrack(),
          learnService.getStats(),
          learnService.getMissions(),
        ]);
        if (cancelled) return;
        setTrack(trackData);
        setStats(statsData);
        setMissions(missionsData);
        // Ofensiva semanal (estilo Duolingo): a cada múltiplo de 7 dias, mostra uma vez por marco.
        const streak = statsData.currentStreak ?? 0;
        if (streak >= 7 && streak % 7 === 0 && !localStorage.getItem(`streak-${streak}`)) {
          setShowStreak(true);
          localStorage.setItem(`streak-${streak}`, "1");
        }
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

  function handleModuloClick(modulo: ModuleWithProgress) {
    if (modulo.status === "LOCKED") return;
    if (modulo.type === "ACTIVITY") {
      navigate(`/modulos/${modulo.id}/exercicio`);
    } else if (modulo.type === "STUDY") {
      navigate(`/modulos/${modulo.id}/teorico`);
    }
  }

  return (
    <div className="bg-[var(--color-bg-primary)]" style={{ height: "100dvh" }}>

      {showStreak && stats && (
        <WeekStreakScreen streak={stats.currentStreak} onContinue={() => setShowStreak(false)} />
      )}

      {/* ── TrackBar: fixed top ── */}
      <div className="fixed top-0 left-0 right-0 z-30 md:left-60 lg:right-64 xl:right-72">
        <TrackBar track={track} loading={loading} />
      </div>

      {/* ── DailyMissions: fixed right (desktop only) ── */}
      <div className="hidden lg:flex fixed top-0 right-0 z-30 h-full items-center">
        <DailyMissions missions={missions} loading={loading} />
      </div>

      {/* ── DailyMissions trigger (mobile/tablet) ── */}
      <button
        type="button"
        onClick={() => setMissionsOpen(true)}
        className="lg:hidden fixed right-3 top-[84px] z-40 flex items-center gap-1.5 rounded-full border border-[var(--color-gray-border)] bg-[var(--color-bg-card)] px-3 py-2 shadow-lg font-fredoka text-sm font-semibold text-[var(--color-text-primary)] active:scale-95"
      >
        <Target size={16} className="text-[var(--color-accent-light)]" />
        Missões
      </button>

      {/* ── DailyMissions modal/bottom-sheet (mobile/tablet) ── */}
      {missionsOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMissionsOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 right-0 bottom-0 max-h-[80dvh] overflow-y-auto">
            <div className="relative">
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setMissionsOpen(false)}
                className="absolute right-6 top-7 z-10 p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X size={20} />
              </button>
              <DailyMissions missions={missions} loading={loading} />
            </div>
          </div>
        </div>
      )}

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
        ) : !track || track.modules.length === 0 ? (
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
            modules={track.modules}
            onModuleClick={handleModuloClick}
          />
        )}
      </div>
    </div>
  );
}
