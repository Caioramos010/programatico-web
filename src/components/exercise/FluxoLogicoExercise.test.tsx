import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import LogicFlowExercise from "./FluxoLogicoExercise";

const displayData = JSON.stringify({ items: ["A", "B", "C"] });

describe("LogicFlowExercise", () => {
  it("chama onAnswer com JSON ordenado quando todos os itens forem selecionados", () => {
    const onAnswer = vi.fn();
    render(
      <LogicFlowExercise
        displayData={displayData}
        imageData={null}
        onAnswer={onAnswer}
        disabled={false}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "A" }));
    fireEvent.click(screen.getByRole("button", { name: "B" }));
    fireEvent.click(screen.getByRole("button", { name: "C" }));

    expect(onAnswer).toHaveBeenLastCalledWith(JSON.stringify(["A", "B", "C"]));
  });

  it("limpa resposta ao remover item da ordem", () => {
    const onAnswer = vi.fn();
    render(
      <LogicFlowExercise
        displayData={displayData}
        imageData={null}
        onAnswer={onAnswer}
        disabled={false}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "A" }));
    fireEvent.click(screen.getByRole("button", { name: "A" }));

    expect(onAnswer).toHaveBeenLastCalledWith("");
  });
});
