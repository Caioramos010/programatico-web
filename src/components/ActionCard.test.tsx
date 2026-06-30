import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ActionCard from "./ActionCard";

describe("ActionCard", () => {
  it("renderiza título e dispara onClick", () => {
    const onClick = vi.fn();
    render(
      <ActionCard
        title="Iniciante"
        description="Começando agora"
        icon={<span>🌱</span>}
        onClick={onClick}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /iniciante/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("aplica estilo selecionado", () => {
    render(
      <ActionCard
        title="Avançado"
        description="Já programa"
        icon={<span>🚀</span>}
        selected
      />,
    );

    expect(screen.getByRole("button").className).toContain("border-[var(--color-accent)]");
  });
});
