import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ExercisePage from "./ExercisePage";

const mockStart = vi.hoisted(() => vi.fn());

vi.mock("../services/exerciseService", () => ({
  exerciseService: { start: mockStart },
}));

vi.mock("../components/exercise/ExerciseSessionFlow", () => ({
  default: () => <div data-testid="session-flow">Sessão</div>,
}));

describe("ExercisePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStart.mockResolvedValue({
      sessionId: 1,
      exercises: [],
      initialLives: 5,
    });
  });

  it("inicia sessão e renderiza fluxo", async () => {
    render(
      <MemoryRouter initialEntries={["/modulos/3/exercicio"]}>
        <Routes>
          <Route path="/modulos/:moduloId/exercicio" element={<ExercisePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/carregando exercícios/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockStart).toHaveBeenCalledWith(3);
    });
    expect(screen.getByTestId("session-flow")).toBeInTheDocument();
  });
});
