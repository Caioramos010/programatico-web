import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import MultipleChoiceExercise from "./AlternativaCorretaExercise";

const displayData = JSON.stringify({
  options: [
    { image: "", description: "Opção A" },
    { image: "", description: "Opção B" },
  ],
});

describe("MultipleChoiceExercise", () => {
  it("dispara onAnswer ao selecionar opção", () => {
    const onAnswer = vi.fn();
    render(
      <MultipleChoiceExercise
        displayData={displayData}
        imageData={null}
        onAnswer={onAnswer}
        disabled={false}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /opção a/i }));
    expect(onAnswer).toHaveBeenCalledWith("Opção A");
  });

  it("não dispara onAnswer quando desabilitado", () => {
    const onAnswer = vi.fn();
    render(
      <MultipleChoiceExercise
        displayData={displayData}
        imageData={null}
        onAnswer={onAnswer}
        disabled={true}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /opção a/i }));
    expect(onAnswer).not.toHaveBeenCalled();
  });

  it("reseta seleção quando displayData muda", () => {
    const onAnswer = vi.fn();
    const { rerender } = render(
      <MultipleChoiceExercise
        displayData={displayData}
        imageData={null}
        onAnswer={onAnswer}
        disabled={false}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /opção a/i }));

    const novoDisplay = JSON.stringify({
      options: [{ image: "", description: "Nova opção" }],
    });
    rerender(
      <MultipleChoiceExercise
        displayData={novoDisplay}
        imageData={null}
        onAnswer={onAnswer}
        disabled={false}
      />,
    );

    expect(screen.getByRole("button", { name: /nova opção/i }).className).not.toContain(
      "border-[var(--color-accent-light)]",
    );
  });
});
