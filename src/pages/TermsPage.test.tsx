import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TermsPage from "./TermsPage";

describe("TermsPage", () => {
  it("renderiza título", () => {
    render(
      <MemoryRouter>
        <TermsPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Termos de Uso")).toBeInTheDocument();
  });
});
