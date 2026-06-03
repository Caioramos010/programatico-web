import { type SVGProps, type ReactElement } from "react";
import { CircleX, Lightning, DebugSearch, Stopwatch } from "../components/icons";
import { toast } from "../components/toast/toastBus";

type IconComponent = (props: SVGProps<SVGSVGElement>) => ReactElement;

interface PraticarCard {
  title: string;
  description: string;
  icon: IconComponent;
  key: string;
}

const cards: PraticarCard[] = [
  {
    key: "erros",
    title: "ERROS",
    description:
      "Exercícios rápidos para corrigir e aprender com os principais erros das últimas lições.",
    icon: CircleX,
  },
  {
    key: "fixacao",
    title: "FIXAÇÃO RÁPIDA",
    description:
      "Atividades diretas para reforçar o conteúdo estudado de forma ágil.",
    icon: Lightning,
  },
  {
    key: "debug",
    title: "DEBUG",
    description:
      "Análise e correção de códigos com erros para aprimorar suas habilidades.",
    icon: DebugSearch,
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
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] font-fredoka">
      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-5">
        {cards.map(({ key, title, description, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => toast.info("Em breve.")}
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
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2 tracking-wide">
                {title}
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
