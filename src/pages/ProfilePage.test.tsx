import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import { useAuthStore } from "../stores/authStore";

const mockGetStats = vi.hoisted(() => vi.fn());

vi.mock("../services/learnService", () => ({
  learnService: { getStats: mockGetStats },
}));

vi.mock("../services/usuarioService", () => ({
  usuarioService: {
    atualizar: vi.fn(),
    solicitarExclusao: vi.fn(),
    confirmarExclusao: vi.fn(),
  },
}));

vi.mock("../components/payments/PaymentHistorySection", () => ({
  default: () => <div>Histórico pagamentos</div>,
}));

describe("ProfilePage", () => {
  beforeEach(() => {
    useAuthStore.getState().login("token", {
      id: 1,
      username: "maria",
      email: "maria@test.com",
      idade: 22,
      ativo: true,
      dataCriacao: "2026-01-01",
      nivelHabilidade: "BEGINNER",
    });
    mockGetStats.mockResolvedValue({
      totalXp: 500,
      currentLives: 5,
      maxLives: 5,
      secondsUntilNextLife: null,
      secondsPerLife: 1800,
      unlimitedLives: false,
      currentStreak: 2,
      maxStreak: 5,
    });
  });

  it("renderiza perfil do usuário", async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("@maria")).toBeInTheDocument();
    });
  });
  it("exibe exclusão de conta na tela principal do perfil", async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Excluir conta")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Excluir a minha conta" })).toBeInTheDocument();
  });
});
