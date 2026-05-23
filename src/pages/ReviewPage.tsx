import { useState } from "react";
import RoundedDropdown from "../components/RoundedDropdown";
import ReviewStatCard from "../components/review/ReviewStatCard";

const completedTracks = [
  "Trilha lógica de programação",
  "Trilha algoritmos",
  "Trilha estruturas de dados",
];

const dayOptions = ["7 dias", "15 dias", "30 dias", "90 dias"];

const mockReviewStats = [
  {
    title: "Exercícios feitos",
    value: "40",
    subtitle: "+8 vs semana passada",
    valueClassName: "text-[#5aa4ff]",
  },
  {
    title: "Taxa de acertos",
    value: "100%",
    subtitle: "20 acertos · 0 erros",
    valueClassName: "text-[#4bf08c]",
  },
  {
    title: "Missões concluídas",
    value: "20",
    subtitle: "de 25 disponíveis",
    valueClassName: "text-white",
  },
  {
    title: "Tempo médio",
    value: "20s",
    subtitle: "por exercício",
    valueClassName: "text-white",
  },
];

export default function ReviewPage() {
  const [selectedTrack, setSelectedTrack] = useState(completedTracks[0]);
  const [selectedDays, setSelectedDays] = useState(dayOptions[0]);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] px-4 py-6 md:px-8 md:py-8 font-fredoka">
      <div className="mx-auto w-full max-w-6xl">
        <header className="px-1 py-2">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <RoundedDropdown
                value={selectedTrack}
                options={completedTracks}
                onChange={setSelectedTrack}
                buttonClassName="flex max-w-full items-center gap-3 cursor-pointer rounded-2xl border border-[#31466e] bg-[#142748] px-4 py-2 text-3xl font-semibold text-white"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:self-center">
              <RoundedDropdown
                value={selectedDays}
                options={dayOptions}
                onChange={setSelectedDays}
                buttonClassName="flex h-11 min-w-32 items-center justify-between gap-3 cursor-pointer rounded-2xl border border-[#31466e] bg-[#142748] px-4 py-2 text-base font-semibold text-white uppercase"
              />

              <button
                type="button"
                className="h-11 min-w-52 cursor-pointer rounded-xl bg-[#2f67ff] px-4 py-2 text-base font-semibold text-white transition-colors hover:bg-[#4c7cff]"
              >
                Gerar Relatório PDF
              </button>
            </div>
          </div>
        </header>

        <section className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {mockReviewStats.map((stat) => (
            <ReviewStatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              valueClassName={stat.valueClassName}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
