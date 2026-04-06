import { useEffect, useState } from "react";
import { Pencil, Trash2, Search } from "lucide-react";
import { adminService, type AdminUsuario, type AdminUsuarioUpdate } from "../../services/adminService";
import { parseApiError } from "../../utils/parseApiError";

interface EditForm {
  role: "USER" | "ADMIN";
  ativo: boolean;
}

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<AdminUsuario[]>([]);
  const [busca, setBusca] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ role: "USER", ativo: true });
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const carregar = async (q?: string) => {
    try {
      const data = await adminService.listarUsuarios(q);
      setUsuarios(data);
    } catch {
      setFormError("Erro ao carregar usuários.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const handleBusca = (valor: string) => {
    setBusca(valor);
    carregar(valor);
  };

  const abrirEditar = (usuario: AdminUsuario) => {
    setEditingId(usuario.id);
    setEditForm({ role: usuario.role, ativo: usuario.ativo });
    setFormError(null);
    setShowModal(true);
  };

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId === null) return;
    setIsSaving(true);
    setFormError(null);
    try {
      const payload: AdminUsuarioUpdate = { role: editForm.role, ativo: editForm.ativo };
      const atualizado = await adminService.atualizarUsuario(editingId, payload);
      setUsuarios((prev) => prev.map((u) => (u.id === editingId ? atualizado : u)));
      setShowModal(false);
    } catch (err) {
      const { formError: msg } = parseApiError(err);
      setFormError(msg ?? "Erro ao salvar.");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmarDelete = async () => {
    if (deleteId === null) return;
    try {
      await adminService.deletarUsuario(deleteId);
      setUsuarios((prev) => prev.filter((u) => u.id !== deleteId));
    } catch {
      setFormError("Erro ao deletar usuário.");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-[var(--color-text-primary)]">Usuários</h1>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            className="pl-9 pr-4 py-2 rounded-xl text-sm bg-[var(--color-bg-card)] text-[var(--color-text-primary)] border border-[var(--color-gray-border)] outline-none focus:border-[var(--color-accent-light)] w-72 placeholder:text-[var(--color-text-muted)]"
            placeholder="Pesquise por nome, cpf ou e-mail do usuário"
            value={busca}
            onChange={(e) => handleBusca(e.target.value)}
          />
        </div>
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
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Nome</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Email</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Tipo</th>
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
            ) : usuarios.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--color-text-muted)]">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr
                  key={usuario.id}
                  style={{ borderBottom: "1px solid var(--color-gray-border)" }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3 text-[var(--color-text-primary)]">{usuario.username}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{usuario.email}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {usuario.role === "ADMIN" ? "Administrador" : "Usuário"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => abrirEditar(usuario)}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteId(usuario.id)}
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

      {/* Modal de edição */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div
            className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-gray-border)" }}
          >
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Editar Usuário</h2>
            <form onSubmit={salvar} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--color-text-muted)]">Tipo</label>
                <select
                  className="w-full rounded-xl px-4 py-2.5 text-sm bg-[var(--color-bg-card-inner)] text-[var(--color-text-primary)] border border-[var(--color-gray-border)] outline-none focus:border-[var(--color-accent-light)]"
                  value={editForm.role}
                  onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value as "USER" | "ADMIN" }))}
                >
                  <option value="USER">Usuário</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={editForm.ativo}
                  onChange={(e) => setEditForm((f) => ({ ...f, ativo: e.target.checked }))}
                  className="w-4 h-4 accent-[var(--color-accent-light)]"
                />
                <label htmlFor="ativo" className="text-sm text-[var(--color-text-secondary)]">
                  Conta ativa
                </label>
              </div>
              {formError && (
                <p className="text-sm text-[var(--color-error-heart)]">{formError}</p>
              )}
              <div className="flex gap-3 justify-end mt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
              Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.
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
