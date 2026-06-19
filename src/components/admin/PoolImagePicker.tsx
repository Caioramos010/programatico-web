import { useState } from "react";
import { X, Search, Check } from "lucide-react";
import { POOL_IMAGENS } from "../../data/poolImagens";

interface PoolImagePickerProps {
  open: boolean;
  onClose: () => void;
  onPick: (path: string) => void;
  current?: string;
}

function fileName(path: string): string {
  return path.split("/").pop() ?? path;
}

export default function PoolImagePicker({ open, onClose, onPick, current }: PoolImagePickerProps) {
  const [filtro, setFiltro] = useState("");

  if (!open) return null;

  const termo = filtro.trim().toLowerCase();
  const imagens = termo
    ? POOL_IMAGENS.filter((p) => fileName(p).toLowerCase().includes(termo))
    : POOL_IMAGENS;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-3xl max-h-[85vh] rounded-2xl flex flex-col overflow-hidden"
        style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-gray-border)" }}
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between gap-4 px-6 py-4 border-b border-[var(--color-gray-border)]">
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Selecionar imagem</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Filtro */}
        <div className="shrink-0 px-6 py-3 border-b border-[var(--color-gray-border)]">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              autoFocus
              className="w-full rounded-xl pl-9 pr-3 py-2.5 text-base bg-[var(--color-bg-card-inner)] text-[var(--color-text-primary)] border border-[var(--color-gray-border)] outline-none focus:border-[var(--color-accent-light)] transition-colors placeholder:text-[var(--color-text-muted)]"
              placeholder="Filtrar pelo nome do arquivo..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
          {imagens.length === 0 ? (
            <p className="text-center py-12 text-base text-[var(--color-text-muted)]">
              Nenhuma imagem encontrada.
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {imagens.map((path) => {
                const selecionada = current === path;
                return (
                  <button
                    key={path}
                    type="button"
                    onClick={() => {
                      onPick(path);
                      onClose();
                    }}
                    title={fileName(path)}
                    className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-colors bg-[var(--color-bg-card-inner)] ${
                      selecionada
                        ? "border-[var(--color-accent-light)]"
                        : "border-transparent hover:border-[var(--color-accent-light)]/60"
                    }`}
                  >
                    <img src={path} alt={fileName(path)} className="w-full h-full object-contain p-1.5" />
                    {selecionada && (
                      <span className="absolute top-1.5 right-1.5 rounded-full p-0.5 bg-[var(--color-accent)] text-white">
                        <Check size={12} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
