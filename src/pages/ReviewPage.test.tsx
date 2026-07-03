import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ReviewPage from "./ReviewPage";
import { useAuthStore } from "../stores/authStore";

const mockGetReview = vi.hoisted(() => vi.fn());

vi.mock("../services/reviewService", () => ({
  reviewService: { getReview: mockGetReview },
}));

vi.mock("../reports/downloadReviewReportPdf", () => ({
  downloadReviewReportPdf: vi.fn(),
}));

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CartesianGrid: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  Legend: () => null,
  Line: () => null,
  Bar: () => null,
}));

describe("ReviewPage", () => {
  beforeEach(() => {
    useAuthStore.getState().login("token", {
      id: 1,
      username: "user",
      email: "user@test.com",
      idade: 20,
      ativo: true,
      dataCriacao: "2026-01-01",
      nivelHabilidade: "BEGINNER",
    });
    mockGetReview.mockResolvedValue({
      selectedTrackId: 1,
      selectedDays: 7,
      currentXp: 100,
      availableTracks: [{ id: 1, title: "Fundamentos" }],
      stats: [],
      performanceData: [],
      subjectAccuracy: [],
      errorsBySubject: [],
      reviewNow: [],
      recentMissions: [],
    });
  });

  it("carrega dados de revisão", async () => {
    render(
      <MemoryRouter>
        <ReviewPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Fundamentos")).toBeInTheDocument();
    });
  });
});
