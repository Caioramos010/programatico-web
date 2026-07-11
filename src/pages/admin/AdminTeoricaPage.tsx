import { SkeletonList } from "../../components/Skeleton";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Plus, Trash2, X, Image as ImageIcon, FileText, LayoutGrid, Layers } from "lucide-react";
import { adminService, type ContentBlockRequest } from "../../services/adminService";
import { parseApiError } from "../../utils/parseApiError";
import AdminEditorShell from "../../components/admin/AdminEditorShell";
import PoolImagePicker from "../../components/admin/PoolImagePicker";

type LayoutType = "TEXT" | "IMAGE" | "CARDS";

interface BlockDraft {
  id?: number;
  layoutType: LayoutType;
  textContent: string;
  /** Caminho da imagem escolhida do pool (blocos IMAGE). */
  imageUrl?: string;
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
            className="flex-1 rounded-lg px-3 py-2 text-base bg-[var(--color-bg-card-inner)] text-[var(--color-text-primary)] border border-[var(--color-gray-border)] outline-none focus:border-[var(--color-accent-light)] transition-colors placeholder:text-[var(--color-text-muted)]"
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
        className="flex items-center gap-1 text-base text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">
        <Plus size={12} /> Adicionar card
      </button>
    </div>
  );
}

function BlockEditor({
  block,
  onChange,
  onDelete,
  onPickImage,
}: {
  block: BlockDraft;
  onChange: (b: BlockDraft) => void;
  onDelete: () => void;
  onPickImage: () => void;
}) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4 border border-[var(--color-gray-border)] bg-[var(--color-bg-card)]">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          {block.layoutType === "TEXT" ? "Texto" : block.layoutType === "IMAGE" ? "Imagem" : "Cards"}
        </span>
        <button type="button" onClick={onDelete}
          className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-error-heart)] hover:bg-white/10 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>

      {block.layoutType === "TEXT" && (
        <div className="flex flex-col gap-1">
          <textarea
            className="w-full rounded-xl px-4 py-3 text-base bg-[var(--color-bg-card-inner)] text-[var(--color-text-primary)] border border-[var(--color-gray-border)] outline-none focus:border-[var(--color-accent-light)] resize-none transition-colors placeholder:text-[var(--color-text-muted)]"
            rows={4}
            maxLength={500}
            placeholder="Escreva o texto aqui (máx. 500 caracteres para caber na tela)..."
            value={block.textContent}
            onChange={(e) => onChange({ ...block, textContent: e.target.value })}
          />
          <span className="text-xs text-[var(--color-text-muted)] text-right">
            {block.textContent.length}/500
          </span>
        </div>
      )}

      {block.layoutType === "IMAGE" && (
        <div className="flex items-center gap-4">
          {block.imageUrl ? (
            <>
              <div className="relative shrink-0">
                <img
                  src={block.imageUrl}
                  alt=""
                  className="w-24 h-24 rounded-xl object-contain bg-[var(--color-bg-card-inner)] border border-[var(--color-gray-border)]"
                />
                <button
                  type="button"
                  onClick={() => onChange({ ...block, imageUrl: "" })}
                  className="absolute -top-2 -right-2 bg-black/70 rounded-full p-1 text-white hover:bg-[var(--color-error)] transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
              <button
                type="button"
                onClick={onPickImage}
                className="px-4 py-2.5 rounded-xl text-base bg-[var(--color-bg-card-inner)] text-[var(--color-text-secondary)] border border-[var(--color-gray-border)] hover:border-[var(--color-accent-light)] transition-colors"
              >
                Trocar
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onPickImage}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-base bg-[var(--color-bg-card-inner)] text-[var(--color-text-secondary)] border border-[var(--color-gray-border)] hover:border-[var(--color-accent-light)] transition-colors"
            >
              <ImageIcon size={14} />
              Selecionar imagem
            </button>
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

const addMenuItems: { type: LayoutType; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { type: "TEXT", label: "Texto", Icon: FileText },
  { type: "IMAGE", label: "Imagem", Icon: ImageIcon },
  { type: "CARDS", label: "Cards", Icon: LayoutGrid },
];

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
  const [pickerIdx, setPickerIdx] = useState<number | null>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setShowAddMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const carregar = async () => {
    if (!paginaId) return;
    try {
      const data = await adminService.listarContentBlocksPorPagina(Number(paginaId));
      setBlocks(data.map((cb) => ({
        id: cb.id,
        layoutType: cb.layoutType,
        textContent: cb.textContent ?? "",
        imageUrl: cb.imageUrl ?? undefined,
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

  const salvar = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setPageError(null);
    setIsSaving(true);
    try {
      const saved: BlockDraft[] = [];
      for (const block of blocks) {
        const payload: ContentBlockRequest = {
          layoutType: block.layoutType,
          textContent: block.layoutType === "IMAGE" ? undefined : block.textContent || undefined,
          imageUrl: block.layoutType === "IMAGE" ? block.imageUrl || undefined : undefined,
          displayOrder: block.displayOrder,
        };
        if (block.id) {
          const updated = await adminService.atualizarContentBlock(block.id, payload);
          saved.push({ id: updated.id, layoutType: updated.layoutType, textContent: updated.textContent ?? "", imageUrl: updated.imageUrl ?? undefined, displayOrder: updated.displayOrder });
        } else {
          const created = await adminService.criarContentBlockParaPagina(Number(paginaId), payload);
          saved.push({ id: created.id, layoutType: created.layoutType, textContent: created.textContent ?? "", imageUrl: created.imageUrl ?? undefined, displayOrder: created.displayOrder });
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

  const breadcrumb = [trackTitle, moduloTitle, paginaTitle].filter(Boolean).join(" / ");
  const subtitle = `${blocks.length} ${blocks.length === 1 ? "bloco" : "blocos"}`;

  const footer = (
    <>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="px-4 py-2 rounded-xl text-base text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        Cancelar
      </button>
      <button
        type="button"
        onClick={() => salvar()}
        disabled={isSaving || isLoading}
        className="px-6 py-2.5 rounded-xl text-base font-semibold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)] disabled:opacity-60 transition-colors"
      >
        {isSaving ? "Salvando..." : "Salvar"}
      </button>
    </>
  );

  return (
    <AdminEditorShell
      breadcrumb={breadcrumb}
      onBack={() => navigate(-1)}
      title="Teórica"
      subtitle={subtitle}
      error={pageError}
      footer={footer}
    >
      {isLoading ? (
        <SkeletonList rows={2} rowClassName="h-32 rounded-2xl" />
      ) : (
        <div className="flex flex-col gap-4">
          {blocks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-[var(--color-gray-border)] text-[var(--color-text-muted)]">
              <Layers size={40} strokeWidth={1.5} className="mb-3 opacity-40" />
              <p className="text-base font-medium">Nenhum bloco ainda</p>
              <p className="text-lg mt-1 text-[var(--color-text-secondary)]">Adicione blocos de texto, imagem ou cards</p>
            </div>
          )}

          {blocks.map((block, idx) => (
            <BlockEditor
              key={block.id ?? `new-${idx}`}
              block={block}
              onChange={(b) => updateBlock(idx, b)}
              onDelete={() => deleteBlock(idx)}
              onPickImage={() => setPickerIdx(idx)}
            />
          ))}

          {/* Add block */}
          <div className="relative" ref={addMenuRef}>
            <button
              type="button"
              onClick={() => setShowAddMenu((v) => !v)}
              className="w-full py-3 rounded-2xl border border-dashed border-[var(--color-gray-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors flex items-center justify-center gap-2 text-base"
            >
              <Plus size={16} /> Adicionar bloco
            </button>

            {showAddMenu && (
              <div
                className="absolute left-0 top-full mt-2 rounded-2xl overflow-hidden z-10 min-w-[180px] shadow-xl"
                style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-gray-border)" }}
              >
                {addMenuItems.map(({ type, label, Icon }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addBlock(type)}
                    className="flex items-center gap-3 w-full px-4 py-3 text-base text-[var(--color-text-primary)] hover:bg-white/5 transition-colors"
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <PoolImagePicker
        open={pickerIdx !== null}
        current={pickerIdx !== null ? blocks[pickerIdx]?.imageUrl : undefined}
        onClose={() => setPickerIdx(null)}
        onPick={(path) => {
          if (pickerIdx !== null) updateBlock(pickerIdx, { ...blocks[pickerIdx], imageUrl: path });
        }}
      />
    </AdminEditorShell>
  );
}
