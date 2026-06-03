import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { learnService } from "../services/learnService";
import type { TheoryResponse, TheoryBlock } from "../services/learnService";
import { parseApiError } from "../utils/parseApiError";

export default function TheoryPage() {
  const { moduloId } = useParams<{ moduloId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [data, setData] = useState<TheoryResponse | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);

  useEffect(() => {
    if (!moduloId) return;
    let cancelled = false;
    setLoading(true);
    setPageError(null);
    learnService
      .getTheory(Number(moduloId))
      .then((response) => {
        if (cancelled) return;
        setData(response);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        const { formError } = parseApiError(err);
        setPageError(formError ?? "Erro ao carregar conteúdo teórico.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [moduloId]);

  function handleExit() {
    navigate("/aprender");
  }

  async function handleFinish() {
    if (!moduloId || isFinishing) return;
    setIsFinishing(true);
    setFinishError(null);
    try {
      await learnService.finishTheory(Number(moduloId));
      navigate("/aprender");
    } catch (err) {
      const { formError } = parseApiError(err);
      setFinishError(formError ?? "Erro ao concluir.");
    } finally {
      setIsFinishing(false);
    }
  }

  function handleNext() {
    if (!data) return;
    if (currentPageIndex < data.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[var(--color-accent-light)] border-t-transparent rounded-full animate-spin" />
          <p className="font-fredoka text-[var(--color-text-muted)]">Carregando conteúdo...</p>
        </div>
      </div>
    );
  }

  if (pageError || !data) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg-primary)]">
        <div className="flex flex-col items-center gap-4 px-8 text-center">
          <p className="font-fredoka text-[var(--color-error-heart)]">
            {pageError ?? "Erro ao carregar conteúdo teórico."}
          </p>
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

  if (data.pages.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg-primary)]">
        <div className="flex flex-col items-center gap-4 px-8 text-center">
          <p className="font-fredoka text-[var(--color-text-muted)]">
            Este módulo ainda não possui conteúdo teórico.
          </p>
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

  const currentPage = data.pages[currentPageIndex];
  const isLastPage = currentPageIndex === data.pages.length - 1;
  const sortedBlocks = [...currentPage.blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "var(--color-bg-primary)" }}>
      {/* Header */}
      <header className="relative px-5 pt-4 pb-3 shrink-0 border-b border-white/5">
        <div className="w-full max-w-2xl mx-auto flex items-center gap-3 pr-10">
          <span className="font-fredoka text-sm text-[var(--color-text-muted)] shrink-0">
            {currentPageIndex + 1}/{data.pages.length}
          </span>
          <h1 className="font-fredoka font-semibold text-base text-[var(--color-text-primary)] truncate">
            {data.moduleTitle}
          </h1>
        </div>
        <button
          type="button"
          aria-label="Sair do conteúdo"
          onClick={handleExit}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <X size={22} />
        </button>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto px-6 py-8">
          <h2 className="font-fredoka font-bold text-2xl text-[var(--color-text-primary)] mb-2">
            {currentPage.title}
          </h2>
          {currentPage.description && (
            <p className="font-fredoka text-[var(--color-text-muted)] text-base mb-6 leading-snug">
              {currentPage.description}
            </p>
          )}

          <div className="flex flex-col gap-6">
            {sortedBlocks.map((block) => (
              <TheoryBlockView key={block.id} block={block} />
            ))}
          </div>

          {finishError && (
            <p className="mt-6 font-fredoka text-base text-[var(--color-error-heart)] text-center">
              {finishError}
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 pb-8 pt-3 shrink-0">
        <button
          type="button"
          disabled={isFinishing}
          onClick={isLastPage ? handleFinish : handleNext}
          className={[
            "w-full max-w-2xl mx-auto block py-4 rounded-2xl font-fredoka font-semibold text-base tracking-wide transition-all duration-150",
            isFinishing
              ? "bg-[var(--color-bg-card)] text-[var(--color-text-muted)] cursor-not-allowed"
              : "bg-[var(--color-accent-light)] text-white hover:opacity-90 active:scale-[0.98] cursor-pointer",
          ].join(" ")}
        >
          {isFinishing ? "Concluindo..." : isLastPage ? "CONCLUIR" : "PRÓXIMO"}
        </button>
      </footer>
    </div>
  );
}

function TheoryBlockView({ block }: { block: TheoryBlock }) {
  if (block.layoutType === "IMAGE") {
    if (!block.imageUrl) return null;
    return (
      <div className="flex justify-center">
        <img
          src={block.imageUrl}
          alt=""
          className="max-w-full h-auto rounded-xl"
          style={{ maxHeight: "60vh" }}
        />
      </div>
    );
  }

  // TODO: CARDS layout has no defined schema yet — render textContent as fallback.
  return (
    <p className="font-fredoka text-base text-[var(--color-text-primary)] leading-relaxed whitespace-pre-wrap">
      {block.textContent ?? ""}
    </p>
  );
}
