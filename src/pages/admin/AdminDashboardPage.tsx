import { useEffect, useState } from "react";
import { Users, Activity, BookOpen, TrendingUp } from "lucide-react";
import { adminService, type DashboardMetrics } from "../../services/adminService";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    adminService
      .getDashboard()
      .then((data) => {
        if (!cancelled) setMetrics(data);
      })
      .catch(() => {
        if (!cancelled) setError("Erro ao carregar métricas.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const formatNumber = (value: number) => value.toLocaleString("pt-BR");

  const cards = [
    {
      label: "Usuários",
      value: metrics ? formatNumber(metrics.totalUsers) : "—",
      icon: Users,
      color: "var(--color-accent-light)",
    },
    {
      label: "Sessões ativas",
      value: metrics ? formatNumber(metrics.activeSessions) : "—",
      icon: Activity,
      color: "var(--color-premium)",
    },
    {
      label: "Lições criadas",
      value: metrics ? formatNumber(metrics.totalModules) : "—",
      icon: BookOpen,
      color: "var(--color-success)",
    },
    {
      label: "Crescimento (30 dias)",
      value: metrics ? `+${metrics.growthPercent}%` : "—",
      icon: TrendingUp,
      color: "var(--color-error-heart)",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[var(--color-text-primary)] mb-2">
        Dashboard
      </h1>
      <p className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-8 leading-relaxed">
        Visão geral da plataforma Programático.
      </p>

      {error && (
        <p className="text-base text-[var(--color-error-heart)] mb-4">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
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
              <p
                className={`text-2xl font-semibold text-[var(--color-text-primary)] ${!metrics && !error ? "animate-pulse" : ""}`}
              >
                {value}
              </p>
              <p className="text-base text-[var(--color-text-muted)] mt-0.5">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
