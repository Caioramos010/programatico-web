import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { exerciseService, type StartSessionResponse } from "../services/exerciseService";
import { parseApiError } from "../utils/parseApiError";

/**
 * Esqueleto Práticas (Hyorran).
 *
 * Inicia a sessão de prática do modo informado na rota (/praticar/:modo) e, por ora,
 * exibe um placeholder com os dados da sessão.
 *
 * TODO(hyorran):
 *  - Reaproveitar a UI de exercícios da ExercisePage para renderizar a sessão.
 *    `exerciseService.respond(sessionId, ...)` e `exerciseService.conclude(sessionId)`
 *    já funcionam para sessões de prática (são agnósticos de módulo).
 *  - Modo "cronometrado": exibir um cronômetro a partir de `session.timeLimitSeconds`
 *    e concluir a sessão automaticamente ao zerar.
 */
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
        Carregando prática…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center bg-[var(--color-bg-primary)]">
        <p>{error}</p>
        <button type="button" onClick={() => navigate("/praticar")} className="underline">
          Voltar
        </button>
      </div>
    );
  }

  // TODO(hyorran): substituir este placeholder pela renderização real dos exercícios.
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-2 px-6 text-center bg-[var(--color-bg-primary)]">
      <h1 className="text-2xl font-bold">{session?.moduleTitle ?? "Prática"}</h1>
      <p>
        {session?.totalExercises ?? 0} exercícios — sessão #{session?.sessionId}
      </p>
      {session?.timeLimitSeconds ? <p>Tempo limite: {session.timeLimitSeconds}s</p> : null}
      <p className="text-sm opacity-70">
        TODO(hyorran): renderizar os exercícios reaproveitando a ExercisePage.
      </p>
    </div>
  );
}
