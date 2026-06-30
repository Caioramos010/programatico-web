import { describe, expect, it, vi } from "vitest";

vi.mock("@react-pdf/renderer", () => ({
  Document: ({ children }: { children: React.ReactNode }) => <div data-testid="pdf-doc">{children}</div>,
  Page: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  View: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  StyleSheet: { create: (styles: unknown) => styles },
  Font: { register: vi.fn() },
}));

import { ReviewReportPdf, type ReviewReportData } from "./ReviewReportPdf";
import { render, screen } from "@testing-library/react";

const sampleData: ReviewReportData = {
  userName: "Maria",
  selectedTrack: "Fundamentos",
  selectedDays: "7 dias",
  extractionDate: "01/01/2026",
  currentXp: 500,
  stats: [{ title: "Acertos", value: "80%", subtitle: "7 dias" }],
  performanceData: [{ day: "Seg", acertos: 5, erros: 1 }],
  subjectAccuracy: [{ assunto: "Lógica", percentual: 80, color: "#5aa4ff" }],
  errorsBySubject: [{ assunto: "Loops", erros: 2 }],
  reviewNow: [{ assunto: "Arrays" }],
  recentMissions: [{ label: "Missão XP", status: "Concluída" }],
};

describe("ReviewReportPdf", () => {
  it("renderiza documento PDF com dados do relatório", () => {
    render(<ReviewReportPdf data={sampleData} />);
    expect(screen.getByTestId("pdf-doc")).toBeInTheDocument();
    expect(screen.getByText(/Maria/)).toBeInTheDocument();
  });
});
