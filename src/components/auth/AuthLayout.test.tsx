import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import AuthLayout from "./AuthLayout";

describe("AuthLayout", () => {
  it("renderiza título, subtítulo e children", () => {
    render(
      <AuthLayout title="Entrar" subtitle="Bem-vindo de volta">
        <p>Formulário</p>
      </AuthLayout>,
    );

    expect(screen.getByText("Entrar")).toBeInTheDocument();
    expect(screen.getByText("Bem-vindo de volta")).toBeInTheDocument();
    expect(screen.getByText("Formulário")).toBeInTheDocument();
  });

  it("dispara onClose ao clicar no botão fechar", () => {
    const onClose = vi.fn();
    render(
      <AuthLayout title="Admin" adminBadge onClose={onClose}>
        <p>Conteúdo</p>
      </AuthLayout>,
    );

    expect(screen.getByText("Administrador")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /fechar/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
