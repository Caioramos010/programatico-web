import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import OnboardingCompletePage from "./OnboardingCompletePage";
import { useAuthStore } from "../../stores/authStore";
import { useOnboardingStore } from "../../stores/onboardingStore";

const navigate = vi.fn();
const mockAtualizarPerfil = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => navigate };
});

vi.mock("../../services/authService", () => ({
  authService: { atualizarPerfil: mockAtualizarPerfil },
}));

describe("OnboardingCompletePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().login("token", {
      id: 1,
      username: "user",
      email: "user@test.com",
      idade: 20,
      ativo: true,
      dataCriacao: "2026-01-01",
      nivelHabilidade: null,
    });
    useOnboardingStore.getState().setLevel("beginner");
    mockAtualizarPerfil.mockResolvedValue({
      id: 1,
      username: "user",
      email: "user@test.com",
      idade: 20,
      ativo: true,
      dataCriacao: "2026-01-01",
      nivelHabilidade: "BEGINNER",
    });
  });

  it("salva nível e vai para aprender", async () => {
    render(
      <MemoryRouter>
        <OnboardingCompletePage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /comece agora/i }));

    await waitFor(() => {
      expect(mockAtualizarPerfil).toHaveBeenCalled();
    });
    expect(navigate).toHaveBeenCalledWith("/aprender");
  });
});
