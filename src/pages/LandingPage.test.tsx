import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "./LandingPage";

describe("LandingPage", () => {
  it("renderiza marca e CTA", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );
    expect(screen.getAllByText("PROGRAMÁTICO").length).toBeGreaterThan(0);
    expect(screen.getByText(/ensino adaptativo/i)).toBeInTheDocument();
  });
});
