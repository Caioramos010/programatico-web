import { Users, Activity, BookOpen, TrendingUp } from "lucide-react";

const metrics = [
  {
    label: "Usuários",
    value: "—",
    icon: Users,
    color: "var(--color-accent-light)",
  },
  {
    label: "Sessões ativas",
    value: "—",
    icon: Activity,
    color: "var(--color-premium)",
  },
  {
    label: "Lições criadas",
    value: "—",
    icon: BookOpen,
    color: "var(--color-success)",
  },
  {
    label: "Crescimento",
    value: "—",
    icon: TrendingUp,
    color: "var(--color-error-heart)",
  },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-[var(--color-text-primary)] mb-2">
        Dashboard
      </h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-8">
        Visão geral da plataforma Programático.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl p-6 flex items-center gap-4"
            style={{
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-gray-border)",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${color}22` }}
            >
              <Icon size={22} style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-[var(--color-text-primary)]">
                {value}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
