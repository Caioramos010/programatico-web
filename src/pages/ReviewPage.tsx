import { useState } from "react";
import RoundedDropdown from "../components/RoundedDropdown";
import Base from "../components/mascot/Base";
import ReviewInfoPanel from "../components/review/ReviewInfoPanel";
import ReviewLevelProgressChart from "../components/review/ReviewLevelProgressChart";
import ReviewPerformanceChart from "../components/review/ReviewPerformanceChart";
import ReviewStatCard from "../components/review/ReviewStatCard";
import ReviewSubjectAccuracy from "../components/review/ReviewSubjectAccuracy";

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

const mockPerformanceData = [
  { day: "Seg", acertos: 8, erros: 3 },
  { day: "Ter", acertos: 10, erros: 5 },
  { day: "Qua", acertos: 11, erros: 2 },
  { day: "Qui", acertos: 9, erros: 4 },
  { day: "Sex", acertos: 7, erros: 6 },
  { day: "Sáb", acertos: 10, erros: 3 },
  { day: "Dom", acertos: 11, erros: 2 },
];

const mockSubjectAccuracy = [
  { assunto: "Sequência lógica", percentual: 95, color: "#5aa4ff" },
  { assunto: "Raciocínio lógico", percentual: 88, color: "#5aa4ff" },
  { assunto: "Lógica base", percentual: 62, color: "#f5c13d" },
  { assunto: "Fluxo lógico", percentual: 45, color: "#f27584" },
];

const mockErrorsBySubject = [
  { assunto: "Fluxo lógico", erros: 12 },
  { assunto: "Lógica base", erros: 10 },
  { assunto: "Raciocínio lógico", erros: 5 },
  { assunto: "Sequência lógica", erros: 3 },
];

const mockReviewNow = [
  { assunto: "Fluxo lógico", toneClassName: "border-[#915665] bg-[#4b3343] text-[#ff7d8d]" },
  { assunto: "Lógica base", toneClassName: "border-[#915665] bg-[#4b3343] text-[#ff7d8d]" },
  { assunto: "Raciocínio lógico", toneClassName: "border-[#8f7b42] bg-[#454249] text-[#ffe26f]" },
  { assunto: "Sequência lógica", toneClassName: "border-[#3f7a74] bg-[#274a58] text-[#62ff9a]" },
];

const mockRecentMissions = [
  { label: "5 acertos seguidos", status: "Concluída", done: true },
  { label: "Sequência sem erros", status: "Concluída", done: true },
  { label: "10 práticas em 7 dias", status: "Em progresso", done: false },
  { label: "Dominar lógica base", status: "Em progresso", done: false },
];

export default function ReviewPage() {
  const [selectedTrack, setSelectedTrack] = useState(completedTracks[0]);
  const [selectedDays, setSelectedDays] = useState(dayOptions[0]);
  const currentLevel = 4;
  const currentXp = 820;
  const nextLevelXp = 1200;
  const remainingXp = Math.max(0, nextLevelXp - currentXp);

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

        <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <ReviewPerformanceChart data={mockPerformanceData} />
          </div>
          <div className="xl:col-span-2">
            <ReviewSubjectAccuracy data={mockSubjectAccuracy} />
          </div>
        </section>

        <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-3">
          <ReviewInfoPanel title="Erros por assunto">
            <div className="divide-y divide-[#344264]">
              {mockErrorsBySubject.map((item) => (
                <div key={item.assunto} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <p className="text-base text-white">{item.assunto}</p>
                  <p className="text-base text-[#ff636c]">{item.erros} erros</p>
                </div>
              ))}
            </div>
          </ReviewInfoPanel>

          <ReviewInfoPanel title="O que revisar agora">
            <div className="flex flex-col gap-3">
              {mockReviewNow.map((item) => (
                <div
                  key={item.assunto}
                  className={["rounded-xl border px-4 py-3 text-base", item.toneClassName].join(" ")}
                >
                  {item.assunto}
                </div>
              ))}
            </div>
          </ReviewInfoPanel>

          <ReviewInfoPanel title="Missões recentes">
            <div className="flex flex-col gap-3">
              {mockRecentMissions.map((mission) => (
                <div key={mission.label} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                  <span
                    className={[
                      "h-2.5 w-2.5 rounded-full",
                      mission.done ? "bg-[#42e886]" : "bg-[#f5c13d]",
                    ].join(" ")}
                  />
                  <p className="text-base text-white">{mission.label}</p>
                  <p className={["text-base", mission.done ? "text-[#42ff8d]" : "text-[#ffd84d]"].join(" ")}>
                    {mission.status}
                  </p>
                </div>
              ))}
            </div>
          </ReviewInfoPanel>
        </section>

        <section className="mt-4 rounded-xl border border-[#31466e] bg-[#273153] px-4 py-5 md:px-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex w-full max-w-2xl flex-col items-center gap-1">
              <div className="relative w-full rounded-2xl bg-[#1c2745] px-4 py-4 text-center">
                <div className="absolute left-[74%] top-full h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#1c2745]" />
                <p className="text-base font-semibold text-white md:text-lg">
                  Você está evoluindo muito bem. Faltam{" "}
                  <span className="text-[#5aa4ff]">{remainingXp} XP</span> para alcançar o próximo nível.
                </p>
              </div>
              <div className="flex w-full items-center justify-center gap-4">
                <ReviewLevelProgressChart
                  currentLevel={currentLevel}
                  currentXp={currentXp}
                  nextLevelXp={nextLevelXp}
                />
                <Base className="h-36 w-36 shrink-0 md:h-40 md:w-40" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
