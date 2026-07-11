/**
 * Splash de carregamento com a marca do sistema: wordmark "programático" e
 * barra de progresso animada (preenche rápido e desacelera — indeterminada).
 * Usada na validação da sessão (SessionGate) e como fallback dos chunks lazy.
 * Mantida leve de propósito (sem mascotes SVG pesados): precisa aparecer
 * instantaneamente enquanto o resto carrega.
 */
export default function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8"
      style={{ background: "var(--color-bg-primary)" }}
      role="status"
      aria-label="Carregando"
    >
      <div className="flex flex-col items-center animate-pulse">
        {/* A Gloria Hallelujah desenha abaixo da linha de base; folga extra
            embaixo pra logo não encostar na tagline. */}
        <span className="font-gloria text-4xl text-white tracking-wide select-none leading-normal mb-4">
          programático
        </span>
        <span className="font-fredoka text-sm uppercase tracking-[0.35em] text-[var(--color-text-muted)] select-none">
          aprenda programando
        </span>
      </div>

      <div className="h-2 w-64 overflow-hidden rounded-full bg-white/10">
        <div className="loading-bar-fill h-full rounded-full" />
      </div>
    </div>
  );
}
