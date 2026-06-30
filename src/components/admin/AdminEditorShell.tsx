import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

interface AdminEditorShellProps {
  breadcrumb: string;
  onBack: () => void;
  title: string;
  subtitle?: string;
  stepLabel?: string;
  children: ReactNode;
  footer: ReactNode;
  error?: string | null;
}

/**
 * Editor full-screen que preenche a area de conteudo do AdminLayout.
 * O `-m-8` cancela o padding do <main> do AdminLayout para ocupar toda a area;
 * apenas o BODY rola — header e footer ficam fixos (shrink-0).
 */
export default function AdminEditorShell({
  breadcrumb,
  onBack,
  title,
  subtitle,
  stepLabel,
  children,
  footer,
  error,
}: AdminEditorShellProps) {
  return (
    <div className="-m-8 h-full flex flex-col bg-[var(--color-bg-primary)]">
      {/* Header fixo */}
      <header className="shrink-0 px-8 pt-6 pb-4 border-b border-[var(--color-gray-border)] bg-[var(--color-bg-primary)]">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-base text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors mb-3 group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          {breadcrumb}
        </button>
        <div className="flex items-end justify-between gap-4">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">{title}</h1>
          {(subtitle || stepLabel) && (
            <div className="flex items-center gap-2 text-base text-[var(--color-text-muted)] pb-1">
              {subtitle && <span>{subtitle}</span>}
              {subtitle && stepLabel && <span className="opacity-40">·</span>}
              {stepLabel && <span className="font-semibold text-[var(--color-text-secondary)]">{stepLabel}</span>}
            </div>
          )}
        </div>
      </header>

      {/* Body rolavel */}
      <div className="flex-1 min-h-0 overflow-y-auto px-8 py-6">
        <div className="max-w-2xl mx-auto">{children}</div>
      </div>

      {/* Footer fixo */}
      <footer className="shrink-0 border-t border-[var(--color-gray-border)] bg-[var(--color-bg-primary)]">
        {error && (
          <p className="px-8 pt-3 text-base text-[var(--color-error-heart)] text-right">{error}</p>
        )}
        <div className="px-8 py-4 flex items-center justify-end gap-3">{footer}</div>
      </footer>
    </div>
  );
}
