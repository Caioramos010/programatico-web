import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import OnboardingWelcomePage from "./OnboardingWelcomePage";

const navigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => navigate };
});

describe("OnboardingWelcomePage", () => {
  it("renderiza boas-vindas e avança", () => {
    render(
      <MemoryRouter>
        <OnboardingWelcomePage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/seja bem-vindo/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /prepare-se/i }));
    expect(navigate).toHaveBeenCalledWith("/onboarding/nivel");
  });
});
