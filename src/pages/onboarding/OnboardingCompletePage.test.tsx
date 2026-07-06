import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import OnboardingCompletePage from "./OnboardingCompletePage";
import { useAuthStore } from "../../stores/authStore";
import { useOnboardingStore } from "../../stores/onboardingStore";

const navigate = vi.fn();
const mockAplicarNivelamento = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => navigate };
});

vi.mock("../../services/learnService", () => ({
  learnService: { aplicarNivelamento: mockAplicarNivelamento },
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
    mockAplicarNivelamento.mockResolvedValue({ nivelInicial: 0, modulosConcluidos: 0 });
  });

  it("explica o nível inicial conforme a escolha", () => {
    useOnboardingStore.getState().setLevel("intermediate");
    render(
      <MemoryRouter>
        <OnboardingCompletePage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Você vai começar no nível 10!")).toBeInTheDocument();
    expect(screen.getByText(/10 primeiros módulos já entram como concluídos/i)).toBeInTheDocument();
  });

  it("aplica o nivelamento e vai para aprender", async () => {
    render(
      <MemoryRouter>
        <OnboardingCompletePage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Você vai começar no nível 0!")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /comece agora/i }));

    await waitFor(() => {
      expect(mockAplicarNivelamento).toHaveBeenCalledWith("BEGINNER");
    });
    expect(useAuthStore.getState().user?.nivelHabilidade).toBe("BEGINNER");
    expect(navigate).toHaveBeenCalledWith("/aprender");
  });
});
