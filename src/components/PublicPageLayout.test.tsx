import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PublicPageLayout from "./PublicPageLayout";

describe("PublicPageLayout", () => {
  it("renderiza navbar e children", () => {
    render(
      <MemoryRouter>
        <PublicPageLayout>
          <p>Conteúdo público</p>
        </PublicPageLayout>
      </MemoryRouter>,
    );

    expect(screen.getAllByText("PROGRAMÁTICO").length).toBeGreaterThan(0);
    expect(screen.getByText("Conteúdo público")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /voltar/i })).toBeInTheDocument();
  });
});
