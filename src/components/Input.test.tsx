import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Input from "./Input";

describe("Input", () => {
  it("exibe mensagem de erro com role alert", () => {
    render(<Input error="Campo obrigatório" placeholder="Nome" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Campo obrigatório");
  });

  it("alterna visibilidade da senha", () => {
    render(<Input type="password" placeholder="Senha" />);

    const input = screen.getByPlaceholderText("Senha");
    expect(input).toHaveAttribute("type", "password");

    fireEvent.click(screen.getByRole("button", { name: /mostrar senha/i }));
    expect(input).toHaveAttribute("type", "text");

    fireEvent.click(screen.getByRole("button", { name: /ocultar senha/i }));
    expect(input).toHaveAttribute("type", "password");
  });
});
