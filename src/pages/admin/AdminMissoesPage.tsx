import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { adminService, type Missao, type MissaoRequest } from "../../services/adminService";
import { parseApiError } from "../../utils/parseApiError";

interface FormState {
  title: string;
  objectiveType: string;
  xpReward: string;
  quantidade: string;
}

const emptyForm: FormState = { title: "", objectiveType: "", xpReward: "", quantidade: "" };

export default function AdminMissoesPage() {
  const [missoes, setMissoes] = useState<Missao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const carregar = async () => {
    try {
      const data = await adminService.listarMissoes();
      setMissoes(data);
    } catch {
      setFormError("Erro ao carregar missões.");
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

  const abrirEditar = (missao: Missao) => {
    setEditingId(missao.id);
    setForm({
      title: missao.title,
      objectiveType: missao.objectiveType,
      xpReward: String(missao.xpReward),
      quantidade: String(missao.quantidade),
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
    if (!form.title.trim() || !form.objectiveType.trim() || !form.xpReward || !form.quantidade) {
      setFormError("Preencha todos os campos.");
      return;
    }
    const payload: MissaoRequest = {
      title: form.title,
      objectiveType: form.objectiveType,
      xpReward: Number(form.xpReward),
      quantidade: Number(form.quantidade),
    };
    setIsSaving(true);
    try {
      if (editingId !== null) {
        const atualizada = await adminService.atualizarMissao(editingId, payload);
        setMissoes((prev) => prev.map((m) => (m.id === editingId ? atualizada : m)));
      } else {
        const nova = await adminService.criarMissao(payload);
        setMissoes((prev) => [...prev, nova]);
      }
      fecharModal();
    } catch (err) {
      const { formError: msg } = parseApiError(err);
      setFormError(msg ?? "Erro ao salvar missão.");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmarDelete = async () => {
    if (deleteId === null) return;
    try {
      await adminService.deletarMissao(deleteId);
      setMissoes((prev) => prev.filter((m) => m.id !== deleteId));
    } catch {
      setFormError("Erro ao deletar missão.");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-[var(--color-text-primary)]">Missões</h1>
        <button
          onClick={abrirCriar}
          className="px-5 py-2 rounded-xl text-sm font-semibold uppercase tracking-widest bg-[var(--color-gray-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-accent)] hover:text-white transition-colors"
        >
          Nova Missão
        </button>
      </div>

      {formError && (
        <p className="text-sm text-[var(--color-error-heart)] mb-4">{formError}</p>
      )}

      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--color-gray-border)", background: "var(--color-bg-card)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-gray-border)" }}>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Tipo</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Quantidade</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">XP</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--color-text-muted)]">
                  Carregando...
                </td>
              </tr>
            ) : missoes.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--color-text-muted)]">
                  Nenhuma missão cadastrada.
                </td>
              </tr>
            ) : (
              missoes.map((missao) => (
                <tr
                  key={missao.id}
                  style={{ borderBottom: "1px solid var(--color-gray-border)" }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3 text-[var(--color-text-primary)]">{missao.objectiveType}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{missao.quantidade}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{missao.xpReward}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => abrirEditar(missao)}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteId(missao.id)}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-error-heart)] transition-colors"
                        title="Deletar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de criação/edição */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div
            className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-gray-border)" }}
          >
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              {editingId !== null ? "Editar Missão" : "Nova Missão"}
            </h2>
            <form onSubmit={salvar} className="flex flex-col gap-3">
              <input
                className="w-full rounded-xl px-4 py-2.5 text-sm bg-[var(--color-bg-card-inner)] text-[var(--color-text-primary)] border border-[var(--color-gray-border)] outline-none focus:border-[var(--color-accent-light)]"
                placeholder="Título *"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
              <input
                className="w-full rounded-xl px-4 py-2.5 text-sm bg-[var(--color-bg-card-inner)] text-[var(--color-text-primary)] border border-[var(--color-gray-border)] outline-none focus:border-[var(--color-accent-light)]"
                placeholder="Tipo de objetivo (ex: Práticas) *"
                value={form.objectiveType}
                onChange={(e) => setForm((f) => ({ ...f, objectiveType: e.target.value }))}
              />
              <div className="flex gap-3">
                <input
                  type="number"
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm bg-[var(--color-bg-card-inner)] text-[var(--color-text-primary)] border border-[var(--color-gray-border)] outline-none focus:border-[var(--color-accent-light)]"
                  placeholder="Quantidade *"
                  value={form.quantidade}
                  min={1}
                  onChange={(e) => setForm((f) => ({ ...f, quantidade: e.target.value }))}
                />
                <input
                  type="number"
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm bg-[var(--color-bg-card-inner)] text-[var(--color-text-primary)] border border-[var(--color-gray-border)] outline-none focus:border-[var(--color-accent-light)]"
                  placeholder="XP *"
                  value={form.xpReward}
                  min={1}
                  onChange={(e) => setForm((f) => ({ ...f, xpReward: e.target.value }))}
                />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div
            className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-gray-border)" }}
          >
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Confirmar exclusão</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Tem certeza que deseja deletar esta missão? Esta ação não pode ser desfeita.
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
