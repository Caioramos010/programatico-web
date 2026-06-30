import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import MatchPairsExercise from "./CombinarParesExercise";

const displayData = JSON.stringify({
  lefts: ["Variável", "Função"],
  rights: ["Armazena valor", "Bloco reutilizável"],
});

describe("MatchPairsExercise", () => {
  it("envia pares parciais ao formar combinação", () => {
    const onAnswer = vi.fn();
    render(
      <MatchPairsExercise
        displayData={displayData}
        onAnswer={onAnswer}
        disabled={false}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Variável" }));
    fireEvent.click(screen.getByRole("button", { name: "Armazena valor" }));

    const lastCall = onAnswer.mock.calls.at(-1)?.[0] as string;
    expect(JSON.parse(lastCall)).toEqual([
      { left: "Variável", right: "Armazena valor" },
    ]);
  });

  it("aplica feedback verde quando par está correto", () => {
    const correctAnswer = JSON.stringify([
      { left: "Variável", right: "Armazena valor" },
      { left: "Função", right: "Bloco reutilizável" },
    ]);

    render(
      <MatchPairsExercise
        displayData={displayData}
        onAnswer={vi.fn()}
        disabled={false}
        correctAnswer={correctAnswer}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Variável" }));
    fireEvent.click(screen.getByRole("button", { name: "Armazena valor" }));

    expect(screen.getByRole("button", { name: "Variável" }).className).toContain(
      "border-[var(--color-success)]",
    );
  });
});
