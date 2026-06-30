import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ModuleNode from "./ModuleNode";

const module = {
  id: 1,
  title: "Variáveis",
  type: "ACTIVITY" as const,
  order: 1,
  status: "UNLOCKED" as const,
  description: null,
  totalXp: 50,
};

describe("ModuleNode", () => {
  it("dispara onClick via botão do módulo", () => {
    const onClick = vi.fn();
    render(<ModuleNode module={module} onClick={onClick} />);

    fireEvent.click(screen.getByRole("button", { name: /variáveis/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renderiza módulo bloqueado com aria-label", () => {
    render(
      <ModuleNode
        module={{ ...module, status: "LOCKED" }}
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /locked/i })).toBeInTheDocument();
  });
});
