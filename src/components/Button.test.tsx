import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Button from "./Button";

describe("Button", () => {
  it("renderiza children e dispara onClick", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Salvar</Button>);

    fireEvent.click(screen.getByRole("button", { name: /salvar/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("não dispara onClick quando desabilitado", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Bloqueado
      </Button>,
    );

    const button = screen.getByRole("button", { name: /bloqueado/i });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("aplica variante white", () => {
    render(<Button variant="white">Branco</Button>);
    expect(screen.getByRole("button", { name: /branco/i }).className).toContain("bg-white");
  });
});
