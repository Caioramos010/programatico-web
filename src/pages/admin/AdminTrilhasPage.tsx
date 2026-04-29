import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Upload, X, ChevronRight } from "lucide-react";
import { adminService, type Trilha, type TrilhaRequest } from "../../services/adminService";
import { parseApiError } from "../../utils/parseApiError";
import { toast } from "../../components/toast/toastBus";
import { adminBasePath } from "../../lib/adminBasePath";

interface FormState {
  title: string;
  description: string;
  icon: string;
}

const emptyForm: FormState = { title: "", description: "", icon: "" };

export default function AdminTrilhasPage() {
  const navigate = useNavigate();
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIconFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, icon: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const carregar = async () => {
    try {
      const data = await adminService.listarTrilhas();
      setTrilhas(data);
    } catch {
      setFormError("Erro ao carregar trilhas.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const abrirCriar = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setShowModal(true);
  };

  const abrirEditar = (trilha: Trilha) => {
    setEditingId(trilha.id);
    setForm({
      title: trilha.title,
      description: trilha.description,
      icon: trilha.icon ?? "",
    });
    setFormError(null);
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setFormError(null);
  };

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.title.trim() || !form.description.trim()) {
      setFormError("Preencha todos os campos obrigatórios.");
      return;
    }
    const payload: TrilhaRequest = {
      title: form.title,
      description: form.description,
      icon: form.icon || undefined,
    };
    setIsSaving(true);
    try {
      if (editingId !== null) {
        const atualizada = await adminService.atualizarTrilha(editingId, payload);
        setTrilhas((prev) => prev.map((t) => (t.id === editingId ? atualizada : t)));
        toast.success("Trilha atualizada com sucesso.");
      } else {
        const nova = await adminService.criarTrilha(payload);
        setTrilhas((prev) => [...prev, nova]);
        toast.success("Trilha criada com sucesso.");
      }
      fecharModal();
    } catch (err) {
      const { formError: msg } = parseApiError(err);
      setFormError(msg ?? "Erro ao salvar trilha.");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmarDelete = async () => {
    if (deleteId === null) return;
    try {
      await adminService.deletarTrilha(deleteId);
      setTrilhas((prev) => prev.filter((t) => t.id !== deleteId));
      toast.success("Trilha excluída.");
    } catch {
      toast.error("Erro ao deletar trilha.");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-[var(--color-text-primary)]">Trilhas</h1>
        <button
          onClick={abrirCriar}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)] transition-colors"
        >
          + Nova Trilha
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-[var(--color-bg-card)] animate-pulse border border-[var(--color-gray-border)]" />
          ))}
        </div>
      ) : trilhas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-[var(--color-gray-border)] text-[var(--color-text-muted)]">
          <p className="text-sm font-medium">Nenhuma trilha cadastrada</p>
          <p className="text-xs mt-1 opacity-70">Crie a primeira trilha da plataforma</p>
          <button
            onClick={abrirCriar}
            className="mt-5 px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)] transition-colors"
          >
            Nova Trilha
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {trilhas.map((trilha, idx) => (
            <div
              key={trilha.id}
              onClick={() => navigate(`${adminBasePath}/trilhas/${trilha.id}/modulos`, { state: { trackTitle: trilha.title } })}
              className="group flex items-center gap-4 px-5 py-4 rounded-2xl border border-[var(--color-gray-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-accent-light)]/50 hover:bg-white/[0.03] transition-all cursor-pointer"
            >
              <span className="text-2xl font-bold text-[var(--color-text-muted)]/25 w-8 shrink-0 select-none tabular-nums">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[var(--color-text-primary)] truncate">{trilha.title}</p>
                {trilha.description && (
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">{trilha.description}</p>
                )}
              </div>
              <span className="hidden sm:block text-xs text-[var(--color-text-muted)] shrink-0">
                {trilha.totalModulos} {trilha.totalModulos === 1 ? "módulo" : "módulos"}
              </span>
              {trilha.icon?.startsWith("data:") ? (
                <img src={trilha.icon} alt="ícone" className="w-8 h-8 rounded-lg object-cover shrink-0" />
              ) : (
                <span className="text-xl shrink-0" title={trilha.icon ?? "Sem ícone"}>{trilha.icon || "⊘"}</span>
              )}
              <div
                className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => abrirEditar(trilha)}
                  className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-colors"
                  title="Editar"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteId(trilha.id)}
                  className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-error-heart)] hover:bg-white/10 transition-colors"
                  title="Deletar"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <ChevronRight size={16} className="text-[var(--color-text-muted)]/30 group-hover:text-[var(--color-text-muted)] shrink-0 transition-colors" />
            </div>
          ))}
        </div>
      )}

      {/* Modal de criação/edição */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-gray-border)" }}
          >
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
              {editingId !== null ? "Editar Trilha" : "Nova Trilha"}
            </h2>
            <form onSubmit={salvar} className="flex flex-col gap-3">
              <input
                className="w-full rounded-xl px-4 py-2.5 text-sm bg-[var(--color-bg-card-inner)] text-[var(--color-text-primary)] border border-[var(--color-gray-border)] outline-none focus:border-[var(--color-accent-light)]"
                placeholder="Título *"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
              <textarea
                className="w-full rounded-xl px-4 py-2.5 text-sm bg-[var(--color-bg-card-inner)] text-[var(--color-text-primary)] border border-[var(--color-gray-border)] outline-none focus:border-[var(--color-accent-light)] resize-none"
                placeholder="Descrição *"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
              <div className="flex flex-col gap-2">
                <label className="w-full rounded-xl px-4 py-2.5 text-sm bg-[var(--color-bg-card-inner)] text-[var(--color-text-secondary)] border border-[var(--color-gray-border)] cursor-pointer hover:border-[var(--color-accent-light)] transition-colors flex items-center gap-2">
                  <Upload size={14} />
                  {form.icon ? "Trocar imagem" : "Selecionar imagem"}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleIconFile}
                  />
                </label>
                {form.icon && (
                  <div className="flex items-center gap-3">
                    <img src={form.icon} alt="Preview" className="w-10 h-10 rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setForm((f) => ({ ...f, icon: "" }));
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-error-heart)] transition-colors"
                    >
                      <X size={12} /> Remover
                    </button>
                  </div>
                )}
              </div>
              {formError && (
                <p className="text-sm text-[var(--color-error-heart)]">{formError}</p>
              )}
              <div className="flex gap-3 justify-end mt-1">
                <button
                  type="button"
                  onClick={fecharModal}
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
          </div>
        </div>
      )}

      {/* Modal de confirmação de delete */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-gray-border)" }}
          >
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Excluir trilha?</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Tem certeza que deseja deletar esta trilha? Todos os módulos associados serão removidos.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarDelete}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-[var(--color-error)] text-white hover:opacity-90 transition-colors"
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
