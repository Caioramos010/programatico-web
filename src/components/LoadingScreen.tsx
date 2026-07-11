/**
 * Tela de carregamento em tela cheia — usada enquanto a sessão persistida é
 * validada (SessionGate) e como fallback dos chunks lazy, evitando flashes de
 * telas erradas ou tela branca.
 */
export default function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4"
      style={{ background: "var(--color-bg-primary)" }}
      role="status"
      aria-label="Carregando"
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[var(--color-accent-light)]" />
      <span className="font-fredoka text-lg text-[var(--color-text-secondary)]">
        Carregando...
      </span>
    </div>
  );
}
