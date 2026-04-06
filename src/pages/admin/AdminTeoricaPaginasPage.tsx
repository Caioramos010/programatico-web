import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, BookOpen, Plus, Pencil, Trash2, FileText } from "lucide-react";
import { adminService, type TeoriaPagina, type TeoriaPaginaRequest } from "../../services/adminService";
import { parseApiError } from "../../utils/parseApiError";

interface FormState {
  title: string;
  description: string;
}

const emptyForm: FormState = { title: "", description: "" };

const inputCls =
  "w-full rounded-xl px-4 py-2.5 text-sm bg-[var(--color-bg-card-inner)] text-[var(--color-text-primary)] border border-[var(--color-gray-border)] outline-none focus:border-[var(--color-accent-light)] transition-colors placeholder:text-[var(--color-text-muted)]";

export default function AdminTeoricaPaginasPage() {
  const { moduloId } = useParams<{ moduloId: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();

  const moduloTitle: string = state?.moduloTitle ?? `Módulo #${moduloId}`;
  const trackTitle: string = state?.trackTitle ?? "";

  const [paginas, setPaginas] = useState<TeoriaPagina[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Create / Edit modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const carregar = async () => {
    if (!moduloId) return;
    try {
      const data = await adminService.listarPaginas(Number(moduloId));
      setPaginas(data);
    } catch {
      setFormError("Erro ao carregar páginas.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { carregar(); }, [moduloId]);

  const abrirCriar = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setShowModal(true);
  };

  const abrirEditar = (e: React.MouseEvent, pagina: TeoriaPagina) => {
    e.stopPropagation();
    setEditingId(pagina.id);
    setForm({ title: pagina.title, description: pagina.description ?? "" });
    setFormError(null);
    setShowModal(true);
  };

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduloId) return;
    setFormError(null);
    setIsSaving(true);
    try {
      const payload: TeoriaPaginaRequest = {
        title: form.title,
        description: form.description || undefined,
      };
      if (editingId !== null) {
        const updated = await adminService.atualizarPagina(editingId, payload);
        setPaginas((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
      } else {
        const created = await adminService.criarPagina(Number(moduloId), payload);
        setPaginas((prev) => [...prev, created]);
      }
      setShowModal(false);
    } catch (err) {
      const { formError: msg } = parseApiError(err);
      setFormError(msg ?? "Erro ao salvar página.");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmarDeletar = async () => {
    if (deletingId === null) return;
    setIsDeleting(true);
    try {
      await adminService.deletarPagina(deletingId);
      setPaginas((prev) => prev.filter((p) => p.id !== deletingId));
      setDeletingId(null);
    } catch {
      setFormError("Erro ao deletar página.");
      setDeletingId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const abrirPagina = (pagina: TeoriaPagina) => {
    navigate(`/paginas/${pagina.id}/conteudo`, {
      state: { paginaTitle: pagina.title, moduloTitle, trackTitle },
    });
  };

  return (
    <div>
      {/* Breadcrumb */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors mb-5 group">
        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        {trackTitle ? `${trackTitle} / ${moduloTitle}` : moduloTitle}
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Páginas</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {paginas.length} {paginas.length === 1 ? "página" : "páginas"}
          </p>
        </div>
        <button
          onClick={abrirCriar}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)] transition-colors">
          <Plus size={16} /> Nova Página
        </button>
      </div>

      {formError && !showModal && (
        <p className="mb-4 text-sm text-[var(--color-error-heart)]">{formError}</p>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-[var(--color-bg-card)] animate-pulse border border-[var(--color-gray-border)]" />
          ))}
        </div>
      ) : paginas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-[var(--color-gray-border)] text-[var(--color-text-muted)]">
          <BookOpen size={40} strokeWidth={1.5} className="mb-3 opacity-40" />
          <p className="text-sm font-medium">Nenhuma página ainda</p>
          <p className="text-xs mt-1 opacity-60">Crie a primeira página de conteúdo</p>
          <button
            onClick={abrirCriar}
            className="mt-5 px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)] transition-colors">
            Nova Página
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {paginas.map((pagina, idx) => (
            <div
              key={pagina.id}
              onClick={() => abrirPagina(pagina)}
              className="group flex items-center gap-4 px-5 py-4 rounded-2xl border border-[var(--color-gray-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-accent-light)]/50 hover:bg-white/[0.03] transition-all cursor-pointer">
              {/* Index */}
              <span className="text-2xl font-bold text-[var(--color-text-muted)]/25 w-8 shrink-0 select-none tabular-nums">
                {String(idx + 1).padStart(2, "0")}
              </span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[var(--color-text-primary)] truncate">{pagina.title}</p>
                {pagina.description && (
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">{pagina.description}</p>
                )}
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center gap-4 text-xs text-[var(--color-text-muted)] shrink-0">
                <span className="flex items-center gap-1">
                  <FileText size={12} />
                  {pagina.totalBlocos} {pagina.totalBlocos === 1 ? "bloco" : "blocos"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={(e) => abrirEditar(e, pagina)}
                  className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-colors"
                  title="Editar">
                  <Pencil size={14} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeletingId(pagina.id); }}
                  className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-error-heart)] hover:bg-white/10 transition-colors"
                  title="Deletar">
                  <Trash2 size={14} />
                </button>
              </div>

              <ChevronRight size={16} className="text-[var(--color-text-muted)]/30 group-hover:text-[var(--color-text-muted)] shrink-0 transition-colors" />
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-5 my-auto"
            style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-gray-border)" }}>
            <div>
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                {editingId !== null ? "Editar Página" : "Nova Página"}
              </h2>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                {editingId !== null ? "Atualize as informações da página" : "Adicione uma nova página ao módulo"}
              </p>
            </div>

            <form onSubmit={salvar} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Título *</label>
                <input
                  className={inputCls}
                  placeholder="Ex: Introdução a Variáveis"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Descrição</label>
                <textarea
                  className={inputCls + " resize-none"}
                  rows={3}
                  placeholder="O que o aluno vai aprender nessa página..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>

              {formError && <p className="text-sm text-[var(--color-error-heart)]">{formError}</p>}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl text-sm font-semibold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)] disabled:opacity-60 transition-colors">
                  {isSaving ? "Salvando..." : editingId !== null ? "Salvar" : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4 my-auto"
            style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-gray-border)" }}>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Excluir página?</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Todo o conteúdo da página será removido permanentemente.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                Cancelar
              </button>
              <button
                onClick={confirmarDeletar}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-[var(--color-error)] text-white hover:opacity-90 transition-colors">
                {isDeleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
