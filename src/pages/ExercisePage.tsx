import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, Heart } from "lucide-react";
import { exerciseService, type SessionExercise, type ConclusionResponse } from "../services/exerciseService";
import { parseApiError } from "../utils/parseApiError";
import MultipleChoiceExercise from "../components/exercise/AlternativaCorretaExercise";
import LogicFlowExercise from "../components/exercise/FluxoLogicoExercise";
import MatchPairsExercise from "../components/exercise/CombinarParesExercise";
import CorrectFeedback from "../components/exercise/FeedbackCorreto";
import IncorrectFeedback from "../components/exercise/FeedbackErrado";
import ConclusionScreen from "../components/exercise/ConclusaoScreen";
import NoLivesScreen from "../components/exercise/NoLivesScreen";

type CurrentPhase = "exercise" | "correct-feedback" | "incorrect-feedback" | "conclusion" | "no-lives";

export default function ExercisePage() {
  const { moduloId: moduleId } = useParams<{ moduloId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [exercises, setExercises] = useState<SessionExercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lives, setLives] = useState(5);
  const [maxLives] = useState(5);

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [phase, setPhase] = useState<CurrentPhase>("exercise");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [relatedTopics, setRelatedTopics] = useState<string[]>([]);

  const [conclusion, setConclusion] = useState<ConclusionResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!moduleId) return;
    exerciseService
      .start(Number(moduleId))
      .then((data) => {
        setSessionId(data.sessionId);
        setExercises(data.exercises);
        setLives(data.initialLives);
        if (data.initialLives === 0) {
          setPhase("no-lives");
        }
        setLoading(false);
      })
      .catch((err) => {
        const { formError } = parseApiError(err);
        setPageError(formError ?? "Erro ao carregar exercícios.");
        setLoading(false);
      });
  }, [moduleId]);

  const currentExercise: SessionExercise | undefined = exercises[currentIndex];

  const handleAnswer = useCallback((answer: string) => {
    setSelectedAnswer(answer);
  }, []);

  // Tracks how many pairs have already been sent to backend (avoids duplicate submits)
  const lastPairsCountRef = useRef<number>(0);

  // PAIRS: auto-submits each new pair formed, resilient to race conditions
  useEffect(() => {
    if (selectedAnswer === "") {
      lastPairsCountRef.current = 0;
      return;
    }
    if (
      currentExercise?.tipo !== "PAIRS" ||
      phase !== "exercise" ||
      sessionId === null ||
      submitting
    ) return;
    let currentCount = 0;
    try { currentCount = (JSON.parse(selectedAnswer) as unknown[]).length; } catch { return; }
    if (currentCount <= lastPairsCountRef.current) return;
    lastPairsCountRef.current = currentCount;
    setSubmitting(true);
    setSubmitError(null);
    exerciseService
      .respond(sessionId, currentExercise.id, selectedAnswer)
      .then((result) => {
        setLives(result.remainingLives);
        // Partial correct pair: don't open feedback, wait for remaining pairs
        if (result.correct && result.correctAnswer === "") return;
        // No lives left — end session
        if (!result.correct && result.remainingLives === 0) {
          setPhase("no-lives");
          return;
        }
        setCorrectAnswer(result.correctAnswer);
        setRelatedTopics(result.relatedTopics);
        setPhase(result.correct ? "correct-feedback" : "incorrect-feedback");
      })
      .catch((err) => {
        const { formError } = parseApiError(err);
        setSubmitError(formError ?? "Erro ao enviar resposta.");
      })
      .finally(() => setSubmitting(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnswer, submitting]);

  async function handleProceed() {
    if (!sessionId || !currentExercise) return;
    if (phase === "correct-feedback" || phase === "incorrect-feedback") {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= exercises.length) {
        try {
          const result = await exerciseService.conclude(sessionId);
          setConclusion(result);
          setPhase("conclusion");
        } catch (err) {
          const { formError } = parseApiError(err);
          setSubmitError(formError ?? "Erro ao concluir sessão.");
        }
      } else {
        setCurrentIndex(nextIndex);
        setSelectedAnswer("");
        setPhase("exercise");
        setSubmitError(null);
      }
      return;
    }

    if (!selectedAnswer) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await exerciseService.respond(sessionId, currentExercise.id, selectedAnswer);
      setLives(result.remainingLives);
      // No lives left — end session
      if (!result.correct && result.remainingLives === 0) {
        setPhase("no-lives");
        return;
      }
      setCorrectAnswer(result.correctAnswer);
      setRelatedTopics(result.relatedTopics);
      setPhase(result.correct ? "correct-feedback" : "incorrect-feedback");
    } catch (err) {
      const { formError } = parseApiError(err);
      setSubmitError(formError ?? "Erro ao enviar resposta.");
    } finally {
      setSubmitting(false);
    }
  }

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

  if (pageError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg-primary)]">
        <div className="flex flex-col items-center gap-4 px-8 text-center">
          <p className="font-fredoka text-[var(--color-error-heart)]">{pageError}</p>
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

  if (phase === "no-lives") {
    return (
      <NoLivesScreen
        onSubscribe={handleExit}
        onBack={handleExit}
      />
    );
  }

  if (phase === "conclusion" && conclusion) {
    return (
      <ConclusionScreen
        xpEarned={conclusion.xpEarned}
        accuracy={conclusion.accuracy}
        durationSeconds={conclusion.durationSeconds}
        onContinue={handleExit}
      />
    );
  }

  const progressPercent = exercises.length > 0
    ? Math.round((currentIndex / exercises.length) * 100)
    : 0;
  const feedbackOpen = phase === "correct-feedback" || phase === "incorrect-feedback";
  const canProceed = phase !== "exercise" || (selectedAnswer.length > 0 && !submitting);

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "var(--color-bg-primary)" }}>

      {/* Header */}
      <header className="relative px-5 pt-4 pb-3 shrink-0">
        <div className="w-full max-w-lg mx-auto flex items-center gap-3 pr-8">
          <span className="font-fredoka text-xs text-[var(--color-text-muted)] shrink-0">
            {currentIndex}/{exercises.length}
          </span>
          <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.12)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%`, background: "var(--color-accent-light)" }}
            />
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Heart size={18} className="text-[var(--color-error-heart)]" fill="currentColor" />
            <span className="font-fredoka text-sm font-semibold text-[var(--color-text-primary)]">
              {lives}/{maxLives}
            </span>
          </div>
        </div>
        <button
          type="button"
          aria-label="Exit exercise"
          onClick={handleExit}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <X size={22} />
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-row overflow-hidden min-h-0">
        {/* Exercise area */}
        <div className="flex-1 flex flex-col items-center py-10 px-6 overflow-y-auto">
          <div className="w-full max-w-lg flex flex-col">
            {currentExercise && (
              <>
                <h2 className="font-fredoka font-bold text-2xl text-[var(--color-text-primary)] mb-1">
                  {currentExercise.tipo === "DRAG_DROP"
                    ? "Fluxo Lógico"
                    : currentExercise.tipo === "PAIRS"
                    ? "Combine Pares"
                    : "Alternativa Correta"}
                </h2>
                <p className="font-fredoka text-[var(--color-text-muted)] text-base mb-8 leading-snug">
                  {currentExercise.statement}
                </p>

                {currentExercise.tipo === "DRAG_DROP" && (
                  <LogicFlowExercise
                    displayData={currentExercise.displayData}
                    imageData={currentExercise.imageData}
                    onAnswer={handleAnswer}
                    disabled={feedbackOpen || submitting}
                  />
                )}
                {currentExercise.tipo === "PAIRS" && (
                  <MatchPairsExercise
                    displayData={currentExercise.displayData}
                    onAnswer={handleAnswer}
                    disabled={feedbackOpen || submitting}
                    correctAnswer={phase === "incorrect-feedback" ? correctAnswer : undefined}
                  />
                )}
                {currentExercise.tipo === "MULTIPLE_CHOICE" && (
                  <MultipleChoiceExercise
                    displayData={currentExercise.displayData}
                    imageData={currentExercise.imageData}
                    onAnswer={handleAnswer}
                    disabled={feedbackOpen || submitting}
                  />
                )}
              </>
            )}
            {submitError && (
              <p className="mt-3 font-fredoka text-sm text-[var(--color-error-heart)]">{submitError}</p>
            )}
          </div>
        </div>

        {/* Feedback panel — right column, naturally below header/X */}
        {feedbackOpen && (
          <aside
            className={[
              "w-80 xl:w-96 shrink-0 flex flex-col p-6 shadow-2xl overflow-y-auto",
              phase === "correct-feedback"
                ? "bg-[var(--color-success-light)] border-l-4 border-[var(--color-success)]"
                : "bg-[var(--color-error-light)] border-l-4 border-[var(--color-error-heart)]/60",
            ].join(" ")}
          >
            {phase === "correct-feedback" && (
              <CorrectFeedback
                relatedTopics={relatedTopics}
                onProceed={handleProceed}
              />
            )}
            {phase === "incorrect-feedback" && (
              <IncorrectFeedback
                correctAnswer={correctAnswer}
                exerciseType={currentExercise?.tipo ?? "MULTIPLE_CHOICE"}
                relatedTopics={relatedTopics}
                onProceed={handleProceed}
              />
            )}
          </aside>
        )}
      </main>

      {/* Proceed button (only when no feedback open and not PAIRS) */}
      {!feedbackOpen && currentExercise?.tipo !== "PAIRS" && (
        <footer className="px-6 pb-8 pt-3 shrink-0">
          <button
            type="button"
            disabled={!canProceed}
            onClick={handleProceed}
            className={[
              "w-full max-w-lg mx-auto block py-4 rounded-2xl font-fredoka font-semibold text-base tracking-wide transition-all duration-150",
              canProceed
                ? "bg-[var(--color-accent-light)] text-white hover:opacity-90 active:scale-[0.98] cursor-pointer"
                : "bg-[var(--color-bg-card)] text-[var(--color-text-muted)] cursor-not-allowed",
            ].join(" ")}
          >
            {submitting ? "Verificando..." : "PROSSEGUIR"}
          </button>
        </footer>
      )}
    </div>
  );
}
