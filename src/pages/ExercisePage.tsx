import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { exerciseService, type SessionExercise } from "../services/exerciseService";
import { parseApiError } from "../utils/parseApiError";
import ExerciseSessionFlow from "../components/exercise/ExerciseSessionFlow";

export default function ExercisePage() {
  const { moduloId: moduleId } = useParams<{ moduloId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [exercises, setExercises] = useState<SessionExercise[]>([]);
  const [initialLives, setInitialLives] = useState(5);
  const [masteredIds, setMasteredIds] = useState<number[]>([]);

  useEffect(() => {
    if (!moduleId) return;
    exerciseService
      .start(Number(moduleId))
      .then((data) => {
        setSessionId(data.sessionId);
        setExercises(data.exercises);
        setInitialLives(data.initialLives);
        setMasteredIds(data.masteredIds ?? []);
        setLoading(false);
      })
      .catch((err) => {
        const { formError } = parseApiError(err);
        setPageError(formError ?? "Erro ao carregar exercícios.");
        setLoading(false);
      });
  }, [moduleId]);

  function handleExit() {
    navigate("/aprender");
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[var(--color-accent-light)] border-t-transparent rounded-full animate-spin" />
          <p className="font-fredoka text-[var(--color-text-muted)]">Carregando exercícios...</p>
        </div>
      </div>
    );
  }

  if (pageError || sessionId === null) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg-primary)]">
        <div className="flex flex-col items-center gap-4 px-8 text-center">
          <p className="font-fredoka text-[var(--color-error-heart)]">{pageError ?? "Erro ao carregar exercícios."}</p>
          <button
            type="button"
            onClick={handleExit}
            className="px-6 py-2 rounded-xl bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] font-fredoka hover:bg-[var(--color-bg-card-inner)] transition-all"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <ExerciseSessionFlow
      sessionId={sessionId}
      exercises={exercises}
      initialLives={initialLives}
      masteredIds={masteredIds}
      onExit={handleExit}
    />
  );
}
