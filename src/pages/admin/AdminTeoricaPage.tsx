import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ChevronLeft, Plus, Trash2, X, Upload, FileText, Image, LayoutGrid } from "lucide-react";
import { adminService, type ContentBlockRequest } from "../../services/adminService";
import { parseApiError } from "../../utils/parseApiError";

type LayoutType = "TEXT" | "IMAGE" | "CARDS";

interface BlockDraft {
  id?: number;
  layoutType: LayoutType;
  textContent: string;
  displayOrder: number;
  isNew?: boolean;
}

function parseCards(raw: string | null): string[] {
  if (!raw) return [""];
  try { return JSON.parse(raw); } catch { return [raw]; }
}

function CardEditor({ cards, onChange }: { cards: string[]; onChange: (c: string[]) => void }) {
  return (
    <div className="flex flex-col gap-2">
      {cards.map((card, i) => (
        <div key={i} className="flex gap-2">
          <input
            className="flex-1 rounded-lg px-3 py-2 text-sm bg-[var(--color-bg-card-inner)] text-[var(--color-text-primary)] border border-[var(--color-gray-border)] outline-none"
            placeholder={`Card ${i + 1}`}
            value={card}
            onChange={(e) => { const c = [...cards]; c[i] = e.target.value; onChange(c); }}
          />
          {cards.length > 1 && (
            <button type="button" onClick={() => onChange(cards.filter((_, j) => j !== i))}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-error-heart)] transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={() => onChange([...cards, ""])}
        className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">
        <Plus size={12} /> Adicionar card
      </button>
    </div>
  );
}

function BlockEditor({
  block,
  onChange,
  onDelete,
}: {
  block: BlockDraft;
  onChange: (b: BlockDraft) => void;
  onDelete: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => onChange({ ...block, textContent: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{ background: "var(--color-bg-card-inner)", border: "1px solid var(--color-gray-border)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          {block.layoutType === "TEXT" ? "Texto" : block.layoutType === "IMAGE" ? "Imagem" : "Cards"}
        </span>
        <button type="button" onClick={onDelete}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-error-heart)] transition-colors">
          <Trash2 size={14} />
        </button>
      </div>

      {block.layoutType === "TEXT" && (
        <textarea
          className="w-full rounded-lg px-3 py-2 text-sm bg-[var(--color-bg-card)] text-[var(--color-text-primary)] border border-[var(--color-gray-border)] outline-none focus:border-[var(--color-accent-light)] resize-none"
          rows={3}
          placeholder="Texto..."
          value={block.textContent}
          onChange={(e) => onChange({ ...block, textContent: e.target.value })}
        />
      )}

      {block.layoutType === "IMAGE" && (
        <div className="flex flex-col gap-2">
          {block.textContent ? (
            <div className="relative w-fit">
              <img src={block.textContent} alt="" className="max-h-40 rounded-lg object-contain" />
              <button type="button"
                onClick={() => { onChange({ ...block, textContent: "" }); if (fileRef.current) fileRef.current.value = ""; }}
                className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 text-white hover:bg-[var(--color-error)] transition-colors">
                <X size={10} />
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-2 w-fit px-4 py-2.5 rounded-xl text-sm bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-[var(--color-gray-border)] cursor-pointer hover:border-[var(--color-accent-light)] transition-colors">
              <Upload size={14} />
              Selecionar imagem (500x500)
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </label>
          )}
        </div>
      )}

      {block.layoutType === "CARDS" && (
        <CardEditor
          cards={parseCards(block.textContent)}
          onChange={(c) => onChange({ ...block, textContent: JSON.stringify(c) })}
        />
      )}
    </div>
  );
}

export default function AdminTeoricaPage() {
  const { paginaId } = useParams<{ paginaId: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const paginaTitle: string = state?.paginaTitle ?? `Página #${paginaId}`;
  const moduloTitle: string = state?.moduloTitle ?? "";
  const trackTitle: string = state?.trackTitle ?? "";

  const [blocks, setBlocks] = useState<BlockDraft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);

  const carregar = async () => {
    if (!paginaId) return;
    try {
      const data = await adminService.listarContentBlocksPorPagina(Number(paginaId));
      setBlocks(data.map((cb) => ({
        id: cb.id,
        layoutType: cb.layoutType,
        textContent: cb.textContent ?? "",
        displayOrder: cb.displayOrder,
      })));
    } catch {
      setPageError("Erro ao carregar conteúdo.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { carregar(); }, [paginaId]);

  const addBlock = (type: LayoutType) => {
    const maxOrder = blocks.reduce((m, b) => Math.max(m, b.displayOrder), 0);
    setBlocks((prev) => [
      ...prev,
      { layoutType: type, textContent: "", displayOrder: maxOrder + 1, isNew: true },
    ]);
    setShowAddMenu(false);
  };

  const updateBlock = (idx: number, updated: BlockDraft) => {
    setBlocks((prev) => prev.map((b, i) => (i === idx ? updated : b)));
  };

  const deleteBlock = async (idx: number) => {
    const block = blocks[idx];
    if (block.id) {
      try {
        await adminService.deletarContentBlock(block.id);
      } catch {
        setPageError("Erro ao remover bloco.");
        return;
      }
    }
    setBlocks((prev) => prev.filter((_, i) => i !== idx));
  };

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setPageError(null);
    setIsSaving(true);
    try {
      const saved: BlockDraft[] = [];
      for (const block of blocks) {
        const payload: ContentBlockRequest = {
          layoutType: block.layoutType,
          textContent: block.textContent || undefined,
          displayOrder: block.displayOrder,
        };
        if (block.id) {
          const updated = await adminService.atualizarContentBlock(block.id, payload);
          saved.push({ id: updated.id, layoutType: updated.layoutType, textContent: updated.textContent ?? "", displayOrder: updated.displayOrder });
        } else {
          const created = await adminService.criarContentBlockParaPagina(Number(paginaId), payload);
          saved.push({ id: created.id, layoutType: created.layoutType, textContent: created.textContent ?? "", displayOrder: created.displayOrder });
        }
      }
      setBlocks(saved);
    } catch (err) {
      const { formError } = parseApiError(err);
      setPageError(formError ?? "Erro ao salvar conteúdo.");
    } finally {
      setIsSaving(false);
    }
  };

  const addMenuItems: { type: LayoutType; label: string; Icon: React.FC<{ size?: number }> }[] = [
    { type: "TEXT", label: "Texto", Icon: FileText },
    { type: "IMAGE", label: "Imagem", Icon: Image },
    { type: "CARDS", label: "Cards", Icon: LayoutGrid },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <button
          onClick={() => navigate(-1)}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm text-[var(--color-text-muted)]">
          {trackTitle ? `${trackTitle} / ` : ""}{moduloTitle ? `${moduloTitle} / ` : ""}{paginaTitle}
        </span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-[var(--color-text-primary)]">Teórica</h1>
      </div>

      {pageError && (
        <p className="mb-4 text-sm text-[var(--color-error-heart)]">{pageError}</p>
      )}

      {isLoading ? (
        <p className="text-[var(--color-text-muted)] text-sm">Carregando...</p>
      ) : (
        <form onSubmit={salvar} className="flex flex-col gap-4 max-w-2xl">
          {blocks.map((block, idx) => (
            <BlockEditor
              key={block.id ?? `new-${idx}`}
              block={block}
              onChange={(b) => updateBlock(idx, b)}
              onDelete={() => deleteBlock(idx)}
            />
          ))}

          {/* Add block button */}
          <div className="relative" ref={addMenuRef}>
            <button
              type="button"
              onClick={() => setShowAddMenu((v) => !v)}
              className="w-full py-3 rounded-xl border border-dashed border-[var(--color-gray-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Plus size={16} /> Adicionar bloco
            </button>

            {showAddMenu && (
              <div
                className="absolute left-0 bottom-full mb-2 rounded-xl overflow-hidden z-10 min-w-[160px] shadow-lg"
                style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-gray-border)" }}
              >
                {addMenuItems.map(({ type, label, Icon }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addBlock(type)}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[var(--color-text-primary)] hover:bg-white/5 transition-colors"
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end mt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)] disabled:opacity-60 transition-colors"
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
