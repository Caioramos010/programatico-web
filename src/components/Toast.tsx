import { useSyncExternalStore } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import {
  dismiss,
  getSnapshot,
  subscribe,
  type ToastVariant,
} from "./toast/toastBus";

const variantStyles: Record<ToastVariant, { icon: typeof CheckCircle2; color: string }> = {
  success: { icon: CheckCircle2, color: "var(--color-accent-light)" },
  error: { icon: XCircle, color: "var(--color-error-heart)" },
  info: { icon: Info, color: "var(--color-text-primary)" },
};

export default function ToastContainer() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  if (items.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {items.map((t) => {
        const { icon: Icon, color } = variantStyles[t.variant];
        return (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex items-center gap-3 min-w-[260px] max-w-sm px-4 py-3 rounded-xl shadow-lg border bg-[var(--color-bg-card)] border-[var(--color-gray-border)] text-sm text-[var(--color-text-primary)] animate-[slideIn_0.2s_ease-out]"
          >
            <Icon size={18} style={{ color }} className="shrink-0" />
            <span className="flex-1">{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
              aria-label="Fechar notificação"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
