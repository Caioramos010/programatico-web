interface BackupCodesModalProps {
  codes: string[];
  onDismiss: () => void;
}

export default function BackupCodesModal({ codes, onDismiss }: BackupCodesModalProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codes.join("\n"));
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="backup-codes-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-gray-border)] bg-[var(--color-bg-secondary)] p-6 shadow-xl">
        <h2 id="backup-codes-title" className="text-xl font-semibold text-white mb-2">
          Códigos de recuperação
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-4 leading-snug">
          Guarde estes códigos em local seguro. Cada um só pode ser usado uma vez no login, no
          lugar do código por e-mail ou do autenticador.{" "}
          <strong className="text-[var(--color-text-secondary)]">
            Eles não serão exibidos novamente.
          </strong>
        </p>
        <ul className="grid grid-cols-2 gap-2 mb-4 font-mono text-sm text-[var(--color-text-primary)]">
          {codes.map((code) => (
            <li
              key={code}
              className="rounded-lg bg-white/10 px-3 py-2 text-center tracking-wider"
            >
              {code}
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => void handleCopy()}
            className="flex-1 rounded-xl border border-[var(--color-gray-border)] px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
          >
            Copiar todos
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="flex-1 rounded-xl bg-white px-4 py-2 text-sm font-medium text-[var(--color-bg-primary)] hover:bg-white/90 transition-colors"
          >
            Já guardei
          </button>
        </div>
      </div>
    </div>
  );
}
