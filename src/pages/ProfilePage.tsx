import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, ShieldCheck } from "lucide-react";
import { Xp, FireOn, FireOff } from "../components/icons";
import Button from "../components/Button";
import { useAuthStore } from "../stores/authStore";
import { authService } from "../services/authService";
import { parseApiError } from "../utils/parseApiError";

/* ── Stat card ── */
function StatCard({
  label,
  value,
  icon,
  full,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div
      className={[
        "flex flex-col gap-1 rounded-xl border border-[var(--color-gray-border)] px-4 py-3",
        full ? "col-span-full" : "",
      ].join(" ")}
    >
      <span className="text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wide">
        {label}
      </span>
      <span className="flex items-center gap-2 text-lg font-semibold text-white">
        {icon}
        {value}
      </span>
    </div>
  );
}

type DeleteStep = "idle" | "confirm" | "code";

/* ── Componente principal ── */
export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuthStore();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  /* Form state */
  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [idade, setIdade] = useState(String(user?.idade ?? ""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* Delete flow */
  const [deleteStep, setDeleteStep] = useState<DeleteStep>("idle");
  const [deleteCode, setDeleteCode] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  /* Refresh profile from API on mount */
  useEffect(() => {
    if (!user) return;
    authService.buscarPerfil(user.id).then(updateUser).catch(() => {/* silent — use cached */});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Sync form when user changes */
  useEffect(() => {
    if (!editing) {
      setUsername(user?.username ?? "");
      setEmail(user?.email ?? "");
      setIdade(String(user?.idade ?? ""));
    }
  }, [user, editing]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        setSaveError("As senhas não coincidem");
        return;
      }
      const strong = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) && /[^a-zA-Z0-9]/.test(newPassword);
      if (!strong) {
        setSaveError("Senha deve conter letra maiúscula, minúscula, número e caractere especial.");
        return;
      }
      if (newPassword.length < 8) {
        setSaveError("Senha deve ter no mínimo 8 caracteres.");
        return;
      }
    }
    if (!user) return;
    setSaving(true);
    setSaveError("");
    try {
      const updated = await authService.atualizarPerfil(user.id, {
        username: username !== user.username ? username : undefined,
        email: email !== user.email ? email : undefined,
        senha: newPassword || undefined,
      });
      updateUser(updated);
      setEditing(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const parsed = parseApiError(err);
      setSaveError(parsed.formError ?? "Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setUsername(user?.username ?? "");
    setEmail(user?.email ?? "");
    setIdade(String(user?.idade ?? ""));
    setNewPassword("");
    setConfirmPassword("");
    setSaveError("");
    setEditing(false);
  };

  const handleRequestDelete = async () => {
    if (!user) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await authService.solicitarExclusaoConta(user.id);
      setDeleteStep("code");
    } catch (err) {
      const parsed = parseApiError(err);
      setDeleteError(parsed.formError ?? "Erro ao solicitar exclusão.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!user) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await authService.confirmarExclusaoConta(user.id, deleteCode);
      logout();
      navigate("/");
    } catch (err) {
      const parsed = parseApiError(err);
      setDeleteError(parsed.formError ?? "Código inválido. Tente novamente.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const memberSince = user?.dataCriacao
    ? new Date(user.dataCriacao).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      })
    : "—";

  /* ── Campo de formulário simplificado ── */
  const Field = ({
    label,
    value,
    onChange,
    type = "text",
    prefix,
    placeholder,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    prefix?: string;
    placeholder?: string;
  }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-sm">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={[
            "w-full rounded-xl border border-[var(--color-gray-border)] bg-transparent",
            "px-4 py-3 text-sm text-white outline-none placeholder:text-[var(--color-text-muted)]",
            "focus:border-white/60 transition-colors",
            prefix ? "pl-10" : "",
          ].join(" ")}
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 font-fredoka flex flex-col gap-6">
      {/* ── Cover + Avatar ── */}
      <div className="relative">
        <div className="relative h-36 rounded-xl bg-gradient-to-br from-[var(--color-gray-border)] to-[var(--color-bg-card)] overflow-hidden" />

        {/* Avatar */}
        <div className="absolute -bottom-8 left-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[var(--color-text-muted)] border-4 border-[var(--color-bg-primary)] overflow-hidden flex items-center justify-center">
              <span className="text-3xl font-bold text-white uppercase select-none">
                {user?.username?.[0] ?? "?"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Spacer for avatar overlap ── */}
      <div className="h-4" />

      {editing ? (
        /* ══════ EDIT MODE ══════ */
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <Field label="Usuário" value={username} onChange={setUsername} prefix="@" />
          <Field label="E-mail" value={email} onChange={setEmail} type="email" />
          <Field
            label="Nova senha (opcional)"
            value={newPassword}
            onChange={setNewPassword}
            type="password"
            placeholder="Deixe em branco para não alterar"
          />
          {newPassword && (
            <Field
              label="Confirmar nova senha"
              value={confirmPassword}
              onChange={setConfirmPassword}
              type="password"
            />
          )}

          {saveError && (
            <p className="text-sm text-[var(--color-error-heart)]">{saveError}</p>
          )}

          <Button type="submit" variant="neutral" className="mt-2" disabled={saving}>
            {saving ? "Salvando..." : "Salvar alterações"}
          </Button>

          <button
            type="button"
            onClick={handleCancel}
            className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors cursor-pointer uppercase tracking-wider font-semibold"
          >
            Cancelar edição
          </button>

          <button
            type="button"
            onClick={() => setDeleteStep("confirm")}
            className="text-sm text-[var(--color-error-heart)] hover:text-red-400 transition-colors cursor-pointer uppercase tracking-wider font-semibold"
          >
            Excluir a minha conta
          </button>
        </form>
      ) : (
        /* ══════ VIEW MODE ══════ */
        <>
          {/* Name + Username + Badge */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-xl font-semibold text-white">@{user?.username}</h2>
              <span className="text-sm text-[var(--color-text-muted)]">{user?.email}</span>
              {user?.ativo && (
                <span className="flex items-center gap-1 text-xs text-[var(--color-accent-light)] mt-0.5">
                  <ShieldCheck size={14} />
                  Conta verificada
                </span>
              )}
              <span className="text-xs text-[var(--color-text-muted)] mt-1">
                Membro desde {memberSince}
              </span>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-gray-border)] text-sm text-[var(--color-text-secondary)] hover:text-white hover:border-white/40 transition-colors cursor-pointer"
            >
              <Pencil size={14} />
              Editar perfil
            </button>
          </div>

          {/* Stats */}
          <section className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-white">Estatísticas</h3>
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Experiência"
                value="0 XP"
                icon={<Xp className="w-5 h-5" />}
                full
              />
              <StatCard
                label="Dias seguidos"
                value={0}
                icon={<FireOn className="w-5 h-5" />}
              />
              <StatCard
                label="Máximo de dias seguidos"
                value={0}
                icon={<FireOff className="w-5 h-5" />}
              />
            </div>
          </section>
        </>
      )}

      {/* ══════ DELETE MODAL ══════ */}
      {deleteStep !== "idle" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-gray-border)] p-6 flex flex-col gap-4 font-fredoka">
            {deleteStep === "confirm" ? (
              <>
                <h3 className="text-lg font-semibold text-white">Excluir conta</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  Esta ação é <strong className="text-white">irreversível</strong>. Vamos enviar
                  um código de confirmação para{" "}
                  <strong className="text-white">{user?.email}</strong>.
                </p>
                {deleteError && (
                  <p className="text-sm text-[var(--color-error-heart)]">{deleteError}</p>
                )}
                <Button
                  variant="neutral"
                  onClick={handleRequestDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Enviando..." : "Enviar código de confirmação"}
                </Button>
                <button
                  onClick={() => { setDeleteStep("idle"); setDeleteError(""); }}
                  className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors cursor-pointer font-semibold"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-white">Digite o código</h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Enviamos um código para <strong className="text-white">{user?.email}</strong>.
                  Digite abaixo para confirmar a exclusão.
                </p>
                <input
                  type="text"
                  value={deleteCode}
                  onChange={(e) => setDeleteCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full rounded-xl border border-[var(--color-gray-border)] bg-transparent px-4 py-3 text-center text-2xl tracking-[0.5em] text-white outline-none focus:border-white/60 transition-colors"
                />
                {deleteError && (
                  <p className="text-sm text-[var(--color-error-heart)]">{deleteError}</p>
                )}
                <Button
                  variant="neutral"
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading || deleteCode.length < 6}
                  className="bg-red-600 hover:bg-red-500 border-red-600"
                >
                  {deleteLoading ? "Excluindo..." : "Confirmar exclusão"}
                </Button>
                <button
                  onClick={() => { setDeleteStep("idle"); setDeleteCode(""); setDeleteError(""); }}
                  className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors cursor-pointer font-semibold"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}