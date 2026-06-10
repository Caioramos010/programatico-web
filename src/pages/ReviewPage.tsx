import { useState } from "react";
import RoundedDropdown from "../components/RoundedDropdown";
import ReviewInfoPanel from "../components/review/ReviewInfoPanel";
import ReviewPerformanceChart from "../components/review/ReviewPerformanceChart";
import ReviewStatCard from "../components/review/ReviewStatCard";
import ReviewSubjectAccuracy from "../components/review/ReviewSubjectAccuracy";
import { downloadReviewReportPdf } from "../reports/downloadReviewReportPdf";
import { useAuthStore } from "../stores/authStore";
import { useEffect } from "react";
import { parseApiError } from "../utils/parseApiError";
import { reviewService } from "../services/reviewService";

const dayOptions = [
  { label: "7 dias", value: 7 },
  { label: "15 dias", value: 15 },
  { label: "30 dias", value: 30 },
  { label: "90 dias", value: 90 },
];

const reviewNowToneClasses = [
  "border-[#915665] bg-[#4b3343] text-[#ff7d8d]",
  "border-[#915665] bg-[#4b3343] text-[#ff7d8d]",
  "border-[#8f7b42] bg-[#454249] text-[#ffe26f]",
  "border-[#3f7a74] bg-[#274a58] text-[#62ff9a]",
];

function formatDaysLabel(days: number) {
  return `${days} dias`;
}

function getDaysValue(label: string) {
  return dayOptions.find((option) => option.label === label)?.value ?? 7;
}

function getStatValueClassName(title: string) {
  if (title === "Exercicios feitos") {
    return "text-[#5aa4ff]";
  }
  if (title === "Taxa de acertos") {
    return "text-[#4bf08c]";
  }
  return "text-white";
}

function getMissionStatusClassName(status: string) {
  return status.startsWith("Concluida") ? "text-[#42ff8d]" : "text-[#ffd84d]";
}

function getMissionDotClassName(status: string) {
  return status.startsWith("Concluida") ? "bg-[#42e886]" : "bg-[#f5c13d]";
}

export default function ReviewPage() {
  const [selectedTrack, setSelectedTrack] = useState("");
  const [selectedDays, setSelectedDays] = useState(dayOptions[0].label);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState<Awaited<ReturnType<typeof reviewService.getReview>> | null>(null);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    void loadReview(undefined, dayOptions[0].value);
  }, []);

  async function loadReview(trackId?: number, days?: number) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await reviewService.getReview({ trackId, days });
      setReviewData(response);
      setSelectedDays(formatDaysLabel(response.selectedDays));

      const currentTrack = response.availableTracks.find((option) => option.id === response.selectedTrackId)
        ?? response.availableTracks[0];
      setSelectedTrack(currentTrack?.title ?? "");
    } catch (requestError) {
      setError(parseApiError(requestError).formError ?? "Nao foi possivel carregar o relatorio.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleTrackChange(trackTitle: string) {
    setSelectedTrack(trackTitle);
    const trackId = reviewData?.availableTracks.find((option) => option.title === trackTitle)?.id;
    await loadReview(trackId, getDaysValue(selectedDays));
  }

  async function handleDaysChange(daysLabel: string) {
    setSelectedDays(daysLabel);
    const trackId = reviewData?.availableTracks.find((option) => option.title === selectedTrack)?.id;
    await loadReview(trackId, getDaysValue(daysLabel));
  }

  const handleGeneratePdfReport = async () => {
    if (!reviewData) {
      return;
    }

    setIsGeneratingPdf(true);
    try {
      const reportDataFromBackend = {
        userName: user?.username ?? "Usuario",
        selectedTrack: selectedTrack || "Sem trilha selecionada",
        selectedDays,
        extractionDate: new Date().toLocaleString("pt-BR"),
        currentXp: reviewData.currentXp,
        stats: reviewData.stats,
        performanceData: reviewData.performanceData,
        subjectAccuracy: reviewData.subjectAccuracy,
        errorsBySubject: reviewData.errorsBySubject,
        reviewNow: reviewData.reviewNow,
        recentMissions: reviewData.recentMissions,
      };

      await downloadReviewReportPdf(reportDataFromBackend);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] px-4 py-6 md:px-8 md:py-8 font-fredoka">
      <div className="mx-auto w-full max-w-6xl">
        <header className="px-1 py-2">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <RoundedDropdown
                value={selectedTrack}
                options={reviewData?.availableTracks.map((option) => option.title) ?? (selectedTrack ? [selectedTrack] : [])}
                onChange={(value) => { void handleTrackChange(value); }}
                buttonClassName="flex max-w-full items-center gap-3 cursor-pointer rounded-2xl border border-[#31466e] bg-[#142748] px-4 py-2 text-3xl font-semibold text-white"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:self-center">
              <RoundedDropdown
                value={selectedDays}
                options={dayOptions.map((option) => option.label)}
                onChange={(value) => { void handleDaysChange(value); }}
                buttonClassName="flex h-11 min-w-32 items-center justify-between gap-3 cursor-pointer rounded-2xl border border-[#31466e] bg-[#142748] px-4 py-2 text-base font-semibold text-white uppercase"
              />

              <button
                type="button"
                onClick={handleGeneratePdfReport}
                disabled={isGeneratingPdf || isLoading || !reviewData}
                className="h-11 min-w-52 cursor-pointer rounded-xl bg-[#2f67ff] px-4 py-2 text-base font-semibold text-white transition-colors hover:bg-[#4c7cff]"
              >
                {isGeneratingPdf ? "Gerando PDF..." : "Gerar Relatório PDF"}
              </button>
            </div>
          </div>
        </header>

        {error ? (
          <section className="mt-4 rounded-xl border border-[#6b3e47] bg-[#3b2630] px-4 py-3 text-base text-[#ffb7c0]">
            {error}
          </section>
        ) : null}

        <section className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {(reviewData?.stats ?? []).map((stat) => (
            <ReviewStatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              valueClassName={getStatValueClassName(stat.title)}
            />
          ))}
        </section>

        <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <ReviewPerformanceChart data={reviewData?.performanceData ?? []} />
          </div>
          <div className="xl:col-span-2">
            <ReviewSubjectAccuracy data={reviewData?.subjectAccuracy ?? []} />
          </div>
        </section>

        <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-3">
          <ReviewInfoPanel title="Erros por assunto">
            <div className="divide-y divide-[#344264]">
              {(reviewData?.errorsBySubject ?? []).map((item) => (
                <div key={item.assunto} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <p className="text-base text-white">{item.assunto}</p>
                  <p className="text-base text-[#ff636c]">{item.erros} erros</p>
                </div>
              ))}
            </div>
          </ReviewInfoPanel>

          <ReviewInfoPanel title="O que revisar agora">
            <div className="flex flex-col gap-3">
              {(reviewData?.reviewNow ?? []).map((item, index) => (
                <div
                  key={item.assunto}
                  className={[
                    "rounded-xl border px-4 py-3 text-base",
                    reviewNowToneClasses[index] ?? reviewNowToneClasses[reviewNowToneClasses.length - 1],
                  ].join(" ")}
                >
                  {item.assunto}
                </div>
              ))}
            </div>
          </ReviewInfoPanel>

          <ReviewInfoPanel title="Missões recentes">
            <div className="flex flex-col gap-3">
              {(reviewData?.recentMissions ?? []).map((mission) => (
                <div key={mission.label} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                  <span
                    className={["h-2.5 w-2.5 rounded-full", getMissionDotClassName(mission.status)].join(" ")}
                  />
                  <p className="text-base text-white">{mission.label}</p>
                  <p className={["text-base", getMissionStatusClassName(mission.status)].join(" ")}>
                    {mission.status}
                  </p>
                </div>
              ))}
            </div>
          </ReviewInfoPanel>
        </section>
      </div>
    </div>
  );
}
