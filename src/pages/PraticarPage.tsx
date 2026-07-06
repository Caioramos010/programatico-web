import { type SVGProps, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { CircleX, Lightning, Stopwatch } from "../components/icons";
import { useAuthStore } from "../stores/authStore";
import { isActiveRoot } from "../lib/subscription";

type IconComponent = (props: SVGProps<SVGSVGElement>) => ReactElement;

interface PraticarCard {
  title: string;
  description: string;
  icon: IconComponent;
  key: string;
  rootOnly?: boolean;
}

const cards: PraticarCard[] = [
  {
    key: "erros",
    title: "ERROS",
    description:
      "Exercícios rápidos para corrigir e aprender com os principais erros das últimas lições.",
    icon: CircleX,
    rootOnly: true,
  },
  {
    key: "fixacao",
    title: "FIXAÇÃO RÁPIDA",
    description:
      "Atividades diretas para reforçar o conteúdo estudado de forma ágil.",
    icon: Lightning,
    rootOnly: true,
  },
  {
    key: "cronometrado",
    title: "CRONOMETRADO",
    description:
      "Desafios temporizados para testar sua velocidade e precisão na programação.",
    icon: Stopwatch,
  },
];

export default function PraticarPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isRoot = isActiveRoot(user);
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] font-fredoka">
      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-5">
        {cards.map(({ key, title, description, icon: Icon, rootOnly }) => (
          <button
            key={key}
            type="button"
            onClick={() =>
              rootOnly && !isRoot ? navigate("/seja-root") : navigate(`/praticar/${key}`)
            }
            className={[
              "flex items-center justify-between gap-6 w-full text-left",
              "px-7 py-6 rounded-2xl",
              "bg-[var(--color-bg-card)] border-2 border-[var(--color-gray-border)]",
              "transition-all duration-200",
              "hover:border-[var(--color-accent-light)] hover:bg-[var(--color-bg-card-inner)]",
              "active:scale-[0.99] cursor-pointer",
            ].join(" ")}
          >
            <div className="flex-1 min-w-0">
              <h2 className="flex items-center gap-3 text-2xl font-bold text-[var(--color-text-primary)] mb-2 tracking-wide">
                {title}
                {rootOnly && !isRoot && (
                  <span className="rounded-md bg-[var(--color-premium)] px-2 py-0.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-bg-card)]">
                    Root
                  </span>
                )}
              </h2>
              <p className="text-base text-[var(--color-text-muted)] leading-snug">
                {description}
              </p>
            </div>
            <Icon className="w-20 h-20 shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
