import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { adminService, type Missao, type MissaoRequest } from "../../services/adminService";
import { parseApiError } from "../../utils/parseApiError";

const TIPOS_MISSAO = ["Módulos", "Teóricas", "Atividades", "Práticas", "Fixação", "Erros", "Cronometrado"] as const;

interface FormState {
  objectiveType: string;
  xpReward: number;
  quantidade: number;
}

const emptyForm: FormState = { objectiveType: TIPOS_MISSAO[0], xpReward: 50, quantidade: 5 };

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
      objectiveType: missao.objectiveType,
      xpReward: missao.xpReward,
      quantidade: missao.quantidade,
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
    if (!form.objectiveType) {
      setFormError("Selecione o tipo de missão.");
      return;
    }
    const payload: MissaoRequest = {
      title: form.objectiveType,
      objectiveType: form.objectiveType,
      xpReward: form.xpReward,
      quantidade: form.quantidade,
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
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-base font-semibold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)] transition-colors"
        >
          + Nova Missão
        </button>
      </div>

      {formError && (
        <p className="text-base text-[var(--color-error-heart)] mb-4">{formError}</p>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-[var(--color-bg-card)] animate-pulse border border-[var(--color-gray-border)]" />
          ))}
        </div>
      ) : missoes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-[var(--color-gray-border)] text-[var(--color-text-muted)]">
          <p className="text-base font-medium">Nenhuma missão cadastrada</p>
          <p className="text-lg mt-1 text-[var(--color-text-secondary)]">Crie a primeira missão da plataforma</p>
          <button
            onClick={abrirCriar}
            className="mt-5 px-4 py-2 rounded-xl text-base font-semibold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)] transition-colors"
          >
            Nova Missão
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {missoes.map((missao, idx) => (
            <div
              key={missao.id}
              className="group flex items-center gap-4 px-5 py-4 rounded-2xl border border-[var(--color-gray-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-accent-light)]/50 hover:bg-white/[0.03] transition-all"
            >
              <span className="text-2xl font-bold text-[var(--color-text-muted)]/25 w-8 shrink-0 select-none tabular-nums">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[var(--color-text-primary)] truncate">{missao.objectiveType}</p>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-base text-[var(--color-text-muted)] shrink-0">
                <span>{missao.quantidade} {missao.quantidade === 1 ? "item" : "itens"}</span>
                <span className="text-yellow-400/80 font-semibold">{missao.xpReward} XP</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => abrirEditar(missao)}
                  className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-colors"
                  title="Editar"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteId(missao.id)}
                  className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-error-heart)] hover:bg-white/10 transition-colors"
                  title="Deletar"
                >
                  <Trash2 size={14} />
                </button>
              </div>
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
              {editingId !== null ? "Editar Missão" : "Nova Missão"}
            </h2>
            <form onSubmit={salvar} className="flex flex-col gap-5">
              {/* Tipo de missão */}
              <div className="flex flex-col gap-2">
                <span className="text-base font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
                  Selecione o tipo de missão
                </span>
                <div className="flex flex-wrap gap-2">
                  {TIPOS_MISSAO.map((tipo) => (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, objectiveType: tipo }))}
                      className="px-3 py-1.5 rounded-lg text-base font-medium transition-colors"
                      style={
                        form.objectiveType === tipo
                          ? { background: "var(--color-accent)", color: "#fff" }
                          : {
                              background: "var(--color-bg-card-inner)",
                              color: "var(--color-text-secondary)",
                              border: "1px solid var(--color-gray-border)",
                            }
                      }
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider de quantidade */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
                    Quantidade de itens a completar
                  </span>
                  <span className="text-base font-semibold text-[var(--color-text-primary)]">{form.quantidade}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base text-[var(--color-text-muted)]">1</span>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    step={1}
                    value={form.quantidade}
                    onChange={(e) => setForm((f) => ({ ...f, quantidade: Number(e.target.value) }))}
                    className="flex-1 accent-[var(--color-accent)]"
                  />
                  <span className="text-base text-[var(--color-text-muted)]">20</span>
                </div>
              </div>

              {/* Slider de XP */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
                    Recompensa de XP
                  </span>
                  <span className="text-base font-semibold text-[var(--color-text-primary)]">{form.xpReward}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base text-[var(--color-text-muted)]">5</span>
                  <input
                    type="range"
                    min={5}
                    max={500}
                    step={5}
                    value={form.xpReward}
                    onChange={(e) => setForm((f) => ({ ...f, xpReward: Number(e.target.value) }))}
                    className="flex-1 accent-[var(--color-accent)]"
                  />
                  <span className="text-base text-[var(--color-text-muted)]">500</span>
                </div>
              </div>
              {formError && (
                <p className="text-base text-[var(--color-error-heart)]">{formError}</p>
              )}
              <div className="flex gap-3 justify-end mt-1">
                <button
                  type="button"
                  onClick={fecharModal}
                  className="px-4 py-2 rounded-xl text-base text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-base font-semibold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)] disabled:opacity-60 transition-colors"
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
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Excluir missão?</h2>
            <p className="text-base text-[var(--color-text-secondary)]">
              Tem certeza que deseja deletar esta missão? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl text-base text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarDelete}
                className="px-5 py-2 rounded-xl text-base font-semibold bg-[var(--color-error)] text-white hover:opacity-90 transition-colors"
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
