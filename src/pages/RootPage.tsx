import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { Clock, Activity, X } from "lucide-react";
import { Crown } from "../components/icons";
import { useAuthStore } from "../stores/authStore";
import { formatSubscriptionExpiresAt, isActiveRoot } from "../lib/subscription";
import { useEffect } from "react";

function FeatureCard({
  icon,
  title,
  items,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/15 px-5 py-4",
        "bg-black/25 backdrop-blur-sm shadow-inner",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-fredoka font-semibold text-lg md:text-xl mb-3">{title}</h2>
          <ul className="space-y-2 text-white/90 font-fredoka font-normal text-base md:text-[1.05rem]">
            {items.map((line) => (
              <li key={line} className="flex gap-2 items-start">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function RootPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!isActiveRoot(user)) {
      navigate("/seja-root", { replace: true });
    }
  }, [user, navigate]);

  if (!isActiveRoot(user)) {
    return null;
  }

  const expiresLabel = formatSubscriptionExpiresAt(user?.subscriptionExpiresAt);

  return (
    <div
      className={[
        "relative min-h-screen w-full overflow-x-hidden",
        "bg-gradient-to-b from-[#7a5a0f] via-[#9a7212] to-[#a67c00]",
        "font-fredoka text-white",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => navigate("/aprender")}
        className={[
          "absolute top-4 right-4 z-10",
          "flex h-10 w-10 items-center justify-center rounded-full",
          "bg-black/20 text-white hover:bg-black/35 transition-colors",
          "border border-white/20 cursor-pointer",
        ].join(" ")}
        aria-label="Fechar e voltar ao aprender"
      >
        <X className="h-5 w-5" strokeWidth={2.5} />
      </button>

      <div className="mx-auto flex max-w-lg flex-col items-center px-5 pb-20 pt-16 md:pt-20">
        <header className="mb-8 flex flex-col items-center gap-4 text-center">
          <Crown
            className="h-20 w-20 shrink-0 drop-shadow-md md:h-24 md:w-24"
            aria-hidden
          />
          <div className="space-y-2">
            <h1 className="text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Você é Root
            </h1>
            {expiresLabel ? (
              <p className="text-lg text-white/95 md:text-xl">
                até {expiresLabel}
              </p>
            ) : null}
          </div>
        </header>

        <p className="mb-8 text-center text-lg font-semibold text-white/95 md:text-xl">
          Aproveite os seus benefícios!
        </p>

        <div className="flex w-full flex-col gap-5">
          <FeatureCard
            icon={<Clock className="h-8 w-8 text-white" strokeWidth={2} aria-hidden />}
            title="Tempo & qualidade de Estudo"
            items={["Práticas de Erros", "Práticas de Fixação"]}
          />
          <FeatureCard
            icon={
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563eb] shadow-md"
                aria-hidden
              >
                <Activity className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
            }
            title="Relatórios & Experiência"
            items={["Relatórios premium", "Sem anúncios", "Vidas infinitas"]}
          />
        </div>
      </div>
    </div>
  );
}
