import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ActivationPage from "./ActivationPage";
import { useAuthStore } from "../stores/authStore";

const navigate = vi.fn();
const mockAtivar = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

vi.mock("../services/authService", () => ({
  authService: {
    ativar: mockAtivar,
    solicitarAtivacao: vi.fn(),
  },
}));

describe("ActivationPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    sessionStorage.setItem("pendingActivationEmail", "novo@email.com");
    useAuthStore.getState().logout();
  });

  it("ativa conta, loga automaticamente e vai para o onboarding", async () => {
    mockAtivar.mockResolvedValue({
      token: "jwt-ativacao",
      tipo: "Bearer",
      usuario: {
        id: 7,
        username: "novo-user",
        email: "novo@email.com",
        idade: 20,
        ativo: true,
        dataCriacao: "2026-01-01",
        nivelHabilidade: null,
      },
    });

    render(
      <MemoryRouter>
        <ActivationPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/insira o código/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^entrar$/i }));

    await waitFor(() => {
      expect(mockAtivar).toHaveBeenCalledWith("123456", "novo@email.com");
    });
    expect(sessionStorage.getItem("pendingActivationEmail")).toBeNull();
    expect(useAuthStore.getState().token).toBe("jwt-ativacao");
    expect(useAuthStore.getState().user?.username).toBe("novo-user");
    expect(navigate).toHaveBeenCalledWith("/onboarding", { replace: true });
  });
});
