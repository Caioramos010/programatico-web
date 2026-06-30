import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ExerciseSessionFlow from "./ExerciseSessionFlow";
import type { SessionExercise } from "../../services/exerciseService";

const mockRespond = vi.hoisted(() => vi.fn());
const mockConclude = vi.hoisted(() => vi.fn());

vi.mock("../../services/exerciseService", () => ({
  exerciseService: {
    respond: mockRespond,
    conclude: mockConclude,
  },
}));

vi.mock("../mascot", () => ({
  Excited: () => <div data-testid="mascot-excited" />,
  Sad: () => <div data-testid="mascot-sad" />,
}));

const multipleChoiceExercise: SessionExercise = {
  id: 1,
  order: 1,
  statement: "Qual alternativa está correta?",
  tipo: "MULTIPLE_CHOICE",
  displayData: JSON.stringify({
    options: [
      { image: "", description: "Opção A" },
      { image: "", description: "Opção B" },
    ],
  }),
  xpReward: 10,
  relatedTopics: ["Lógica"],
  imageData: null,
};

describe("ExerciseSessionFlow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mostra tela sem vidas quando initialLives é zero", () => {
    render(
      <ExerciseSessionFlow
        sessionId={1}
        exercises={[multipleChoiceExercise]}
        initialLives={0}
        onExit={vi.fn()}
      />,
    );

    expect(screen.getByText("Suas vidas acabaram")).toBeInTheDocument();
  });

  it("envia resposta e exibe feedback correto", async () => {
    const onExit = vi.fn();
    mockRespond.mockResolvedValue({
      correct: true,
      correctAnswer: "Opção A",
      remainingLives: 4,
      relatedTopics: ["Lógica"],
    });
    mockConclude.mockResolvedValue({
      xpEarned: 50,
      accuracy: 100,
      durationSeconds: 60,
      remainingLives: 4,
      moduleCompleted: true,
    });

    render(
      <ExerciseSessionFlow
        sessionId={10}
        exercises={[multipleChoiceExercise]}
        initialLives={5}
        onExit={onExit}
      />,
    );

    expect(screen.getByText("Qual alternativa está correta?")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /opção a/i }));
    fireEvent.click(screen.getByRole("button", { name: /^prosseguir$/i }));

    await waitFor(() => {
      expect(mockRespond).toHaveBeenCalledWith(10, 1, "Opção A");
    });

    expect(screen.getByText("Ótima resposta!")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^prosseguir$/i }));

    await waitFor(() => {
      expect(mockConclude).toHaveBeenCalledWith(10);
    });

    expect(screen.getByText("Você conseguiu!")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /continuar/i }));
    expect(onExit).toHaveBeenCalled();
  });

  it("chama onExit ao clicar em sair", () => {
    const onExit = vi.fn();

    render(
      <ExerciseSessionFlow
        sessionId={1}
        exercises={[multipleChoiceExercise]}
        initialLives={3}
        onExit={onExit}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /sair/i }));
    expect(onExit).toHaveBeenCalledTimes(1);
  });

  it("mostra tela sem vidas após errar sem vidas restantes", async () => {
    mockRespond.mockResolvedValue({
      correct: false,
      correctAnswer: "Opção B",
      remainingLives: 0,
      relatedTopics: [],
    });

    render(
      <ExerciseSessionFlow
        sessionId={10}
        exercises={[multipleChoiceExercise]}
        initialLives={1}
        onExit={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /opção a/i }));
    fireEvent.click(screen.getByRole("button", { name: /^prosseguir$/i }));

    await waitFor(() => {
      expect(screen.getByText("Suas vidas acabaram")).toBeInTheDocument();
    });
  });
});
