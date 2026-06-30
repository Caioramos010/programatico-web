import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PrivacyPage from "./PrivacyPage";

describe("PrivacyPage", () => {
  it("renderiza título", () => {
    render(
      <MemoryRouter>
        <PrivacyPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Política de Privacidade")).toBeInTheDocument();
  });
});
