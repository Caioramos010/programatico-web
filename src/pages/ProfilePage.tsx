import { useEffect, useRef, useState, type FormEvent } from "react";
import { Camera, ShieldCheck, X } from "lucide-react";
import { Xp, FireOn, FireOff } from "../components/icons";
import Button from "../components/Button";
import { useAuthStore } from "../stores/authStore";
import { learnService, type UserStatsResponse } from "../services/learnService";
import { usuarioService } from "../services/usuarioService";
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
  const { user, login, token, logout } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [stats, setStats] = useState<UserStatsResponse | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [deleteStep, setDeleteStep] = useState<DeleteStep>("idle");
  const [deleteCode, setDeleteCode] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* Form state */
  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatarData, setAvatarData] = useState<string>(user?.icon ?? "");

  useEffect(() => {
    learnService.getStats().then(setStats).catch(() => {});
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setFormError(null);
    setIsSaving(true);
    try {
      const payload: Record<string, string> = {};
      if (username !== user.username) payload.username = username;
      if (email !== user.email) payload.email = email;
      if (newPassword) payload.senha = newPassword;
      if (avatarData !== (user.icon ?? "")) payload.icon = avatarData;

      const updated = await usuarioService.atualizar(user.id, payload);
      login(token!, updated);
      setEditing(false);
    } catch (err) {
      const { formError: msg, fieldErrors } = parseApiError(err);
      setFormError(msg ?? (fieldErrors ? Object.values(fieldErrors)[0] : "Erro ao salvar alterações."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setUsername(user?.username ?? "");
    setEmail(user?.email ?? "");
    setCurrentPassword("");
    setNewPassword("");
    setAvatarData(user?.icon ?? "");
    setFormError(null);
    setEditing(false);
  };

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarData(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRequestDelete = async () => {
    if (!user) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await usuarioService.solicitarExclusao(user.id);
      setDeleteStep("code");
    } catch (err) {
      const { formError: msg } = parseApiError(err);
      setDeleteError(msg ?? "Erro ao solicitar exclusão.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!user) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await usuarioService.confirmarExclusao(user.id, deleteCode);
      logout();
    } catch (err) {
      const { formError: msg } = parseApiError(err);
      setDeleteError(msg ?? "Código inválido ou expirado.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const displayAvatar = editing ? avatarData : (user?.icon ?? "");

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 font-fredoka flex flex-col gap-6">
      {/* Cover + Avatar */}
      <div className="relative">
        <div className="h-36 rounded-xl bg-gradient-to-br from-[var(--color-gray-border)] to-[var(--color-bg-card)] overflow-hidden" />
        <div className="absolute -bottom-8 left-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[var(--color-text-muted)] border-4 border-[var(--color-bg-primary)] overflow-hidden">
              {displayAvatar ? (
                <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-400" />
              )}
            </div>
            {editing && (
              <div className="absolute -top-1 -right-1 flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="p-1 rounded-full bg-black/60 text-white/80 hover:text-white transition-colors cursor-pointer"
                  aria-label="Editar avatar"
                >
                  <Camera size={14} />
                </button>
                {displayAvatar && (
                  <button
                    type="button"
                    onClick={() => { setAvatarData(""); if (avatarInputRef.current) avatarInputRef.current.value = ""; }}
                    className="p-1 rounded-full bg-black/60 text-white/80 hover:text-[var(--color-error-heart)] transition-colors cursor-pointer"
                    aria-label="Remover avatar"
                  >
                    <X size={14} />
                  </button>
                )}
                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-4" />

      {editing ? (
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          {/* Usuário */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Usuário</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-sm">@</span>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-gray-border)] bg-transparent pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-white/60 transition-colors" />
            </div>
          </div>
          {/* E-mail */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-gray-border)] bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-white/60 transition-colors" />
          </div>
          {/* Senha atual */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Senha atual</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-gray-border)] bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-white/60 transition-colors" />
          </div>
          {/* Nova senha */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Nova senha</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-gray-border)] bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-white/60 transition-colors" />
          </div>

          {formError && <p className="text-sm text-[var(--color-error-heart)]">{formError}</p>}

          <Button type="submit" variant="neutral" className="mt-2" disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar alterações"}
          </Button>
          <button type="button" onClick={handleCancel}
            className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors cursor-pointer uppercase tracking-wider font-semibold">
            Cancelar edição
          </button>
          <button type="button"
            onClick={() => setDeleteStep("confirm")}
            className="text-sm text-[var(--color-error-heart)] hover:text-red-400 transition-colors cursor-pointer uppercase tracking-wider font-semibold">
            Excluir a minha conta
          </button>
        </form>
      ) : (
        <>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-xl font-semibold text-white">@{user?.username}</h2>
            <span className="text-sm text-[var(--color-text-muted)]">{user?.email}</span>
            {user?.ativo && <ShieldCheck size={20} className="text-[var(--color-accent-light)] mt-1" />}
          </div>

          <section className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-white">Estatísticas</h3>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Experiência" value={`${(stats?.totalXp ?? 0).toLocaleString("pt-BR")} XP`} icon={<Xp className="w-5 h-5" />} full />
              <StatCard label="Dias seguidos" value={stats?.sequenciaAtual ?? 0} icon={<FireOn className="w-5 h-5" />} />
              <StatCard label="Máximo de dias seguidos" value={stats?.maxSequencia ?? 0} icon={<FireOff className="w-5 h-5" />} />
            </div>
          </section>

          <Button variant="neutral" onClick={() => setEditing(true)}>
            Editar perfil
          </Button>
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