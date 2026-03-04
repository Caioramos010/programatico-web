import { useState, type FormEvent } from "react";
import { Pencil, Camera, ShieldCheck } from "lucide-react";
import { Xp, FireOn, FireOff } from "../components/icons";
import Button from "../components/Button";

/* ── Dados mock ── */
const mockUser = {
  name: "Caio de souza Ramos",
  username: "user_teste",
  email: "",
  xp: 12320,
  streak: 0,
  maxStreak: 0,
  verified: true,
  avatarUrl: "",
  coverUrl: "",
};

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

/* ── Componente principal ── */
export default function ProfilePage() {
  const [editing, setEditing] = useState(false);

  /* Form state */
  const [name, setName] = useState(mockUser.name);
  const [username, setUsername] = useState(mockUser.username);
  const [email, setEmail] = useState(mockUser.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    // TODO: call API
    setEditing(false);
  };

  const handleCancel = () => {
    setName(mockUser.name);
    setUsername(mockUser.username);
    setEmail(mockUser.email);
    setCurrentPassword("");
    setNewPassword("");
    setEditing(false);
  };

  /* ── Campo de formulário simplificado ── */
  const Field = ({
    label,
    value,
    onChange,
    type = "text",
    prefix,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    prefix?: string;
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
          className={[
            "w-full rounded-xl border border-[var(--color-gray-border)] bg-transparent",
            "px-4 py-3 text-sm text-white outline-none",
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
        {/* Cover */}
        <div className="relative h-36 rounded-xl bg-gradient-to-br from-[var(--color-gray-border)] to-[var(--color-bg-card)] overflow-hidden">
          {mockUser.coverUrl && (
            <img
              src={mockUser.coverUrl}
              alt="Capa"
              className="w-full h-full object-cover"
            />
          )}
          {editing && (
            <button
              type="button"
              className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/50 text-white/80 hover:text-white transition-colors cursor-pointer"
              aria-label="Editar capa"
            >
              <Pencil size={16} />
            </button>
          )}
        </div>

        {/* Avatar */}
        <div className="absolute -bottom-8 left-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[var(--color-text-muted)] border-4 border-[var(--color-bg-primary)] overflow-hidden">
              {mockUser.avatarUrl ? (
                <img
                  src={mockUser.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-400" />
              )}
            </div>
            {editing && (
              <button
                type="button"
                className="absolute -top-1 -right-1 p-1 rounded-full bg-black/60 text-white/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Editar avatar"
              >
                <Camera size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Spacer for avatar overlap ── */}
      <div className="h-4" />

      {editing ? (
        /* ══════ EDIT MODE ══════ */
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <Field label="Nome" value={name} onChange={setName} />
          <Field
            label="Usuário"
            value={username}
            onChange={setUsername}
            prefix="@"
          />
          <Field label="E-mail" value={email} onChange={setEmail} type="email" />
          <Field
            label="Senha atual"
            value={currentPassword}
            onChange={setCurrentPassword}
            type="password"
          />
          <Field
            label="Nova senha"
            value={newPassword}
            onChange={setNewPassword}
            type="password"
          />

          <Button type="submit" variant="neutral" className="mt-2">
            Salvar alterações
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
            className="text-sm text-[var(--color-error-heart)] hover:text-red-400 transition-colors cursor-pointer uppercase tracking-wider font-semibold"
          >
            Excluir a minha conta
          </button>
        </form>
      ) : (
        /* ══════ VIEW MODE ══════ */
        <>
          {/* Name + Username + Badge */}
          <div className="flex flex-col gap-0.5">
            <h2 className="text-xl font-semibold text-white">{mockUser.name}</h2>
            <span className="text-sm text-[var(--color-text-muted)]">
              @{mockUser.username}
            </span>
            {mockUser.verified && (
              <ShieldCheck
                size={20}
                className="text-[var(--color-accent-light)] mt-1"
              />
            )}
          </div>

          {/* Stats */}
          <section className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-white">Estatísticas</h3>

            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Experiência"
                value={`${mockUser.xp.toLocaleString("pt-BR")} XP`}
                icon={<Xp className="w-5 h-5" />}
                full
              />
              <StatCard
                label="Dias seguidos"
                value={mockUser.streak}
                icon={<FireOn className="w-5 h-5" />}
              />
              <StatCard
                label="Máximo de dias seguidos"
                value={mockUser.maxStreak}
                icon={<FireOff className="w-5 h-5" />}
              />
            </div>
          </section>

          {/* Edit button */}
          <Button variant="neutral" onClick={() => setEditing(true)}>
            Editar perfil
          </Button>
        </>
      )}
    </div>
  );
}
