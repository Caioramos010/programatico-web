import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LearnPage from "./LearnPage";

const mockGetTrack = vi.hoisted(() => vi.fn());
const mockGetStats = vi.hoisted(() => vi.fn());
const mockGetMissions = vi.hoisted(() => vi.fn());

vi.mock("../services/learnService", () => ({
  learnService: {
    getTrack: mockGetTrack,
    getStats: mockGetStats,
    getMissions: mockGetMissions,
  },
}));

describe("LearnPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTrack.mockResolvedValue({
      id: 1,
      title: "Trilha JS",
      description: "",
      icon: null,
      modules: [],
      completedPercentage: 0,
      totalModules: 0,
      completedModules: 0,
    });
    mockGetStats.mockResolvedValue({
      totalXp: 0,
      currentLives: 5,
      maxLives: 5,
      secondsUntilNextLife: null,
      secondsPerLife: 1800,
      unlimitedLives: false,
      currentStreak: 0,
      maxStreak: 0,
    });
    mockGetMissions.mockResolvedValue([]);
  });

  it("carrega trilha e exibe título", async () => {
    render(
      <MemoryRouter>
        <LearnPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Trilha JS")).toBeInTheDocument();
    });
  });
});
