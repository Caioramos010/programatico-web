import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import IncorrectFeedback from "./FeedbackErrado";

describe("IncorrectFeedback", () => {
  it("exibe resposta de múltipla escolha literalmente", () => {
    render(
      <IncorrectFeedback
        correctAnswer="Opção A"
        exerciseType="MULTIPLE_CHOICE"
        relatedTopics={[]}
        onProceed={vi.fn()}
      />,
    );

    expect(screen.getByText("Opção A")).toBeInTheDocument();
  });

  it("formata resposta de drag and drop", () => {
    render(
      <IncorrectFeedback
        correctAnswer='["Primeiro","Segundo"]'
        exerciseType="DRAG_DROP"
        relatedTopics={[]}
        onProceed={vi.fn()}
      />,
    );

    expect(screen.getByText("Primeiro")).toBeInTheDocument();
    expect(screen.getByText("Segundo")).toBeInTheDocument();
  });

  it("formata pares e exibe assuntos relacionados", () => {
    const onProceed = vi.fn();
    render(
      <IncorrectFeedback
        correctAnswer='[{"left":"A","right":"1"},{"left":"B","right":"2"}]'
        exerciseType="PAIRS"
        relatedTopics={["Lógica"]}
        onProceed={onProceed}
      />,
    );

    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Lógica")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /prosseguir/i }));
    expect(onProceed).toHaveBeenCalledTimes(1);
  });
});
