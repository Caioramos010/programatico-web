import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AboutPage from "./AboutPage";

describe("AboutPage", () => {
  it("renderiza hero", () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/democratizar/i)).toBeInTheDocument();
  });
});
