import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import OnboardingLevelPage from "./OnboardingLevelPage";

const navigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => navigate };
});

describe("OnboardingLevelPage", () => {
  it("seleciona nível e avança", () => {
    render(
      <MemoryRouter>
        <OnboardingLevelPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Nível de habilidade")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /iniciante/i }));
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }));
    expect(navigate).toHaveBeenCalledWith("/onboarding/conclusao");
  });
});
