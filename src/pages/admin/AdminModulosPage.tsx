import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Pencil, Trash2, ChevronLeft, BookOpen, Zap, ChevronRight, GripVertical } from "lucide-react";
import { adminService, type Modulo, type ModuloRequest } from "../../services/adminService";
import { parseApiError } from "../../utils/parseApiError";
import { toast } from "../../components/toast/toastBus";
import { adminBasePath } from "../../lib/adminBasePath";

type ModuleType = "ACTIVITY" | "STUDY";

interface FormState {
  title: string;
  moduleType: ModuleType;
  description: string;
}

const emptyForm: FormState = { title: "", moduleType: "STUDY", description: "" };

export default function AdminModulosPage() {
  const { trilhaId } = useParams<{ trilhaId: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const trackTitle: string = state?.trackTitle ?? `Trilha #${trilhaId}`;

  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Drag-and-drop reorder
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const dragNode = useRef<HTMLDivElement | null>(null);

  const carregar = async () => {
    if (!trilhaId) return;
    try {
      const data = await adminService.listarModulos(Number(trilhaId));
      setModulos(data);
    } catch {
      setFormError("Erro ao carregar módulos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { carregar(); }, [trilhaId]);

  const abrirCriar = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setShowModal(true);
  };

  const abrirEditar = (modulo: Modulo, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(modulo.id);
    setForm({ title: modulo.title, moduleType: modulo.moduleType, description: modulo.description ?? "" });
    setFormError(null);
    setShowModal(true);
  };

  const fecharModal = () => { setShowModal(false); setFormError(null); };

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.title.trim()) { setFormError("Nome do módulo é obrigatório."); return; }
    if (form.title.trim().length > 100) { setFormError("Nome do módulo deve ter no máximo 100 caracteres."); return; }
    const payload: ModuloRequest = { title: form.title.trim(), moduleType: form.moduleType, description: form.description.trim() || undefined };
    setIsSaving(true);
    try {
      if (editingId !== null) {
        const atualizado = await adminService.atualizarModulo(editingId, payload);
        setModulos((prev) => prev.map((m) => (m.id === editingId ? atualizado : m)));
        fecharModal();
        toast.success("Módulo atualizado com sucesso.");
      } else {
        const novo = await adminService.criarModulo(Number(trilhaId), payload);
        setModulos((prev) => [...prev, novo]);
        fecharModal();
        toast.success("Módulo criado com sucesso.");
        abrirConteudo(novo);
      }
    } catch (err) {
      const { formError: msg } = parseApiError(err);
      setFormError(msg ?? "Erro ao salvar módulo.");
    } finally {
      setIsSaving(false);
    }
  };

  const abrirConteudo = (modulo: Modulo) => {
    const path =
      modulo.moduleType === "ACTIVITY"
        ? `${adminBasePath}/modulos/${modulo.id}/atividades`
        : `${adminBasePath}/modulos/${modulo.id}/conteudo`;
    navigate(path, { state: { moduloTitle: modulo.title, trackTitle } });
  };

  const confirmarDelete = async () => {
    if (deleteId === null) return;
    try {
      await adminService.deletarModulo(deleteId);
      setModulos((prev) => prev.filter((m) => m.id !== deleteId));
      toast.success("Módulo excluído.");
    } catch {
      toast.error("Erro ao deletar módulo.");
    }
    finally { setDeleteId(null); }
  };

  const onDragStart = (e: React.DragEvent, idx: number) => {
    setDragIndex(idx);
    dragNode.current = e.currentTarget as HTMLDivElement;
    e.dataTransfer.effectAllowed = "move";
    // Brief delay so browser uses the div as ghost image, not a blank
    setTimeout(() => { if (dragNode.current) dragNode.current.style.opacity = "0.4"; }, 0);
  };

  const onDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (idx !== dragIndex) setDropIndex(idx);
  };

  const onDrop = async (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === idx) { resetDrag(); return; }
    const reordenado = [...modulos];
    const [moved] = reordenado.splice(dragIndex, 1);
    reordenado.splice(idx, 0, moved);
    setModulos(reordenado);
    resetDrag();
    try {
      await adminService.reordenarModulos(Number(trilhaId), reordenado.map((m) => m.id));
    } catch {
      setFormError("Erro ao reordenar módulos.");
      carregar(); // rollback
    }
  };

  const onDragEnd = () => {
    resetDrag();
  };

  const resetDrag = () => {
    if (dragNode.current) dragNode.current.style.opacity = "";
    dragNode.current = null;
    setDragIndex(null);
    setDropIndex(null);
  };

  const TypeBadge = ({ type }: { type: ModuleType }) =>
    type === "STUDY"
      ? <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400"><BookOpen size={12}/> Teórico</span>
      : <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/15 text-yellow-400"><Zap size={12}/> Atividade</span>;

  const inputCls = "w-full rounded-xl px-4 py-3 text-sm bg-[var(--color-bg-card-inner)] text-[var(--color-text-primary)] border border-[var(--color-gray-border)] outline-none focus:border-[var(--color-accent-light)] transition-colors placeholder:text-[var(--color-text-muted)]";

  return (
    <div>
      <button onClick={() => navigate(`${adminBasePath}/trilhas`)}
        className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors mb-5 group">
        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        {trackTitle}
      </button>

      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Módulos</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{modulos.length} {modulos.length === 1 ? "módulo" : "módulos"}</p>
        </div>
        <button onClick={abrirCriar}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)] transition-colors">
          + Novo módulo
        </button>
      </div>

      {formError && !showModal && <p className="mb-4 text-sm text-[var(--color-error-heart)]">{formError}</p>}

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1,2,3].map((i) => <div key={i} className="h-20 rounded-2xl bg-[var(--color-bg-card)] animate-pulse border border-[var(--color-gray-border)]" />)}
        </div>
      ) : modulos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-[var(--color-gray-border)] text-[var(--color-text-muted)]">
          <BookOpen size={36} className="mb-3 opacity-40" />
          <p className="text-sm font-medium">Nenhum módulo ainda</p>
          <p className="text-xs mt-1 opacity-70">Crie o primeiro módulo desta trilha</p>
          <button onClick={abrirCriar}
            className="mt-5 px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)] transition-colors">
            Criar módulo
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {modulos.map((modulo, idx) => (
            <div key={modulo.id}
              draggable
              onDragStart={(e) => onDragStart(e, idx)}
              onDragOver={(e) => onDragOver(e, idx)}
              onDragLeave={() => setDropIndex(null)}
              onDrop={(e) => onDrop(e, idx)}
              onDragEnd={onDragEnd}
              onClick={() => abrirConteudo(modulo)}
              className={[
                "group flex items-center gap-4 px-5 py-4 rounded-2xl border bg-[var(--color-bg-card)] hover:bg-white/[0.03] transition-all cursor-pointer",
                dropIndex === idx && dragIndex !== idx
                  ? "border-[var(--color-accent)] shadow-[0_0_0_2px_var(--color-accent)]/20"
                  : "border-[var(--color-gray-border)] hover:border-[var(--color-accent-light)]/50",
              ].join(" ")}>
              {/* Drag handle */}
              <GripVertical size={16} className="text-[var(--color-text-muted)]/30 group-hover:text-[var(--color-text-muted)]/60 shrink-0 cursor-grab active:cursor-grabbing" />
              <span className="text-2xl font-bold text-[var(--color-text-muted)]/25 w-8 shrink-0 select-none tabular-nums">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[var(--color-text-primary)] truncate">{modulo.title}</p>
                {modulo.description && <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">{modulo.description}</p>}
              </div>
              <TypeBadge type={modulo.moduleType} />
              <div className="hidden sm:flex items-center gap-4 text-xs text-[var(--color-text-muted)] shrink-0">
                <span>{modulo.totalComponentes} {modulo.totalComponentes === 1 ? "item" : "itens"}</span>
                {modulo.totalXp > 0 && <span className="text-yellow-400/80">{modulo.totalXp} XP</span>}
              </div>
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => abrirEditar(modulo, e)}
                  className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-colors" title="Editar">
                  <Pencil size={14} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setDeleteId(modulo.id); }}
                  className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-error-heart)] hover:bg-white/10 transition-colors" title="Deletar">
                  <Trash2 size={14} />
                </button>
              </div>
              <ChevronRight size={16} className="text-[var(--color-text-muted)]/30 group-hover:text-[var(--color-text-muted)] shrink-0 transition-colors" />
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-5"
            style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-gray-border)" }}>
            <div>
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                {editingId !== null ? "Editar módulo" : "Novo módulo"}
              </h2>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                {editingId !== null ? "Altere os dados do módulo" : "Configure e avance para adicionar conteúdo"}
              </p>
            </div>
            <form onSubmit={salvar} className="flex flex-col gap-4">
              <div className="flex gap-2">
                {(["STUDY", "ACTIVITY"] as ModuleType[]).map((type) => (
                  <button key={type} type="button" onClick={() => setForm((f) => ({ ...f, moduleType: type }))}
                    className={"flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all border " + (
                      form.moduleType === type
                        ? type === "STUDY" ? "bg-blue-500/15 text-blue-400 border-blue-400/30" : "bg-yellow-500/15 text-yellow-400 border-yellow-400/30"
                        : "bg-transparent text-[var(--color-text-muted)] border-[var(--color-gray-border)] hover:border-[var(--color-text-muted)]"
                    )}>
                    {type === "STUDY" ? <BookOpen size={14}/> : <Zap size={14}/>}
                    {type === "STUDY" ? "Teórico" : "Atividade"}
                  </button>
                ))}
              </div>
              <input autoFocus className={inputCls} placeholder="Nome do módulo *"
                value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              <textarea className={inputCls + " resize-none"} placeholder="Descrição (opcional)" rows={3}
                value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              {formError && <p className="text-sm text-[var(--color-error-heart)]">{formError}</p>}
              <div className="flex gap-3 justify-end pt-1">
                <button type="button" onClick={fecharModal}
                  className="px-4 py-2 rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isSaving}
                  className="px-6 py-2 rounded-xl text-sm font-semibold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)] disabled:opacity-60 transition-colors">
                  {isSaving ? "Salvando..." : editingId !== null ? "Salvar" : "Criar e editar conteúdo →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-gray-border)" }}>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Excluir módulo?</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Todo o conteúdo associado será removido permanentemente. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end pt-1">
              <button onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                Cancelar
              </button>
              <button onClick={confirmarDelete}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-[var(--color-error)] text-white hover:opacity-90 transition-colors">
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
