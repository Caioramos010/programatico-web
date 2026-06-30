import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ReviewInfoPanel from "./ReviewInfoPanel";

describe("ReviewInfoPanel", () => {
  it("renderiza título e conteúdo", () => {
    render(
      <ReviewInfoPanel title="Resumo">
        <p>Detalhes da revisão</p>
      </ReviewInfoPanel>,
    );

    expect(screen.getByText("Resumo")).toBeInTheDocument();
    expect(screen.getByText("Detalhes da revisão")).toBeInTheDocument();
  });
});
