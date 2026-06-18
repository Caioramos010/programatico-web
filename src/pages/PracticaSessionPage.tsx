import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { exerciseService, type StartSessionResponse } from "../services/exerciseService";
import { parseApiError } from "../utils/parseApiError";
import ExerciseSessionFlow from "../components/exercise/ExerciseSessionFlow";

export default function PracticaSessionPage() {
  const { modo } = useParams<{ modo: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<StartSessionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!modo) return;
    setLoading(true);
    setError(null);
    exerciseService
      .startPractice(modo)
      .then((data) => setSession(data))
      .catch((err) => setError(parseApiError(err).formError ?? "Não foi possível iniciar a prática."))
      .finally(() => setLoading(false));
  }, [modo]);

  function handleExit() {
    navigate("/praticar");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[var(--color-accent-light)] border-t-transparent rounded-full animate-spin" />
          <p className="font-fredoka text-[var(--color-text-muted)]">Carregando prática…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center bg-[var(--color-bg-primary)]">
        <p className="font-fredoka text-[var(--color-text-primary)]">{error}</p>
        <button
          type="button"
          onClick={handleExit}
          className="px-6 py-2 rounded-xl bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] font-fredoka hover:bg-[var(--color-bg-card-inner)] transition-all"
        >
          Voltar
        </button>
      </div>
    );
  }

  if (!session) return null;

  return (
    <ExerciseSessionFlow
      sessionId={session.sessionId}
      exercises={session.exercises}
      initialLives={session.initialLives}
      onExit={handleExit}
    />
  );
}
