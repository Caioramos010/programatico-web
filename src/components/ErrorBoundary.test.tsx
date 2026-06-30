import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

function Boom(): never {
  throw new Error("falha simulada");
}

describe("ErrorBoundary", () => {
  it("renderiza fallback quando filho lança erro", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Algo deu errado")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /recarregar/i })).toBeInTheDocument();

    spy.mockRestore();
  });

  it("renderiza filhos quando não há erro", () => {
    render(
      <ErrorBoundary>
        <div>Conteúdo ok</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText("Conteúdo ok")).toBeInTheDocument();
  });
});
