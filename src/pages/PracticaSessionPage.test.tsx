import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PracticaSessionPage from "./PracticaSessionPage";

const mockStartPractice = vi.hoisted(() => vi.fn());

vi.mock("../services/exerciseService", () => ({
  exerciseService: { startPractice: mockStartPractice },
}));

vi.mock("../components/exercise/ExerciseSessionFlow", () => ({
  default: () => <div data-testid="practice-flow">Prática</div>,
}));

describe("PracticaSessionPage", () => {
  beforeEach(() => {
    mockStartPractice.mockResolvedValue({
      sessionId: 2,
      exercises: [],
      initialLives: 5,
      moduleTitle: "Prática",
      totalExercises: 0,
    });
  });

  it("inicia prática por modo", async () => {
    render(
      <MemoryRouter initialEntries={["/praticar/erros"]}>
        <Routes>
          <Route path="/praticar/:modo" element={<PracticaSessionPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockStartPractice).toHaveBeenCalledWith("erros");
    });
    expect(screen.getByTestId("practice-flow")).toBeInTheDocument();
  });
});
