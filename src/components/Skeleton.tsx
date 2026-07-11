/**
 * Blocos de skeleton reutilizáveis — placeholders com a forma aproximada do
 * conteúdo enquanto os dados carregam, no lugar de spinners/textos genéricos.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  // rounded-xl só como default: quem passa outro rounded (ex.: rounded-full
  // nos nós do mapa) não ganha classes conflitantes.
  const rounded = className.includes("rounded") ? "" : "rounded-xl";
  return (
    <div
      aria-hidden
      className={`animate-pulse bg-[var(--color-bg-card-inner)] ${rounded} ${className}`}
    />
  );
}

/** Linhas de texto fantasma com larguras alternadas. */
export function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`} aria-hidden>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={`h-4 ${i % 3 === 1 ? "w-3/4" : i % 3 === 2 ? "w-1/2" : "w-full"}`} />
      ))}
    </div>
  );
}

/** Card fantasma com borda igual aos cards reais. */
export function SkeletonCard({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div
      aria-hidden
      className={`rounded-2xl border border-[var(--color-gray-border)] bg-[var(--color-bg-card)] p-5 ${className}`}
    >
      {children ?? <SkeletonText lines={2} />}
    </div>
  );
}

/** Lista de cards fantasma (notificações, histórico, linhas de admin). */
export function SkeletonList({ rows = 4, rowClassName = "h-16" }: { rows?: number; rowClassName?: string }) {
  return (
    <div className="flex flex-col gap-3" role="status" aria-label="Carregando">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className={rowClassName} />
      ))}
    </div>
  );
}
