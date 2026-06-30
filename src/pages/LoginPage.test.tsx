import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "./LoginPage";
import { useAuthStore } from "../stores/authStore";

const navigate = vi.fn();
const mockIniciarLogin = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

vi.mock("../services/authService", () => ({
  authService: {
    iniciarLogin: mockIniciarLogin,
  },
}));

const sampleUser = {
  id: 1,
  username: "user",
  email: "user@test.com",
  idade: 20,
  ativo: true,
  dataCriacao: "2026-01-01",
  nivelHabilidade: "BEGINNER" as const,
};

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().logout();
    sessionStorage.clear();
  });

  it("redireciona para verificação quando 2FA é exigido", async () => {
    mockIniciarLogin.mockResolvedValue({
      requiresVerification: true,
      verificationMethod: "EMAIL",
      mensagem: "Código enviado",
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/e-mail ou nome de usuário/i), {
      target: { value: "user@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/^senha$/i), {
      target: { value: "Senha@123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }));

    await waitFor(() => {
      expect(mockIniciarLogin).toHaveBeenCalledWith("user@test.com", "Senha@123");
    });
    expect(navigate).toHaveBeenCalledWith(
      "/login/verificacao",
      expect.objectContaining({
        state: expect.objectContaining({
          emailOuUsername: "user@test.com",
          senha: "Senha@123",
        }),
      }),
    );
  });

  it("faz login direto quando não exige verificação", async () => {
    mockIniciarLogin.mockResolvedValue({
      requiresVerification: false,
      token: "jwt-token",
      usuario: sampleUser,
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/e-mail ou nome de usuário/i), {
      target: { value: "user" },
    });
    fireEvent.change(screen.getByPlaceholderText(/^senha$/i), {
      target: { value: "Senha@123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }));

    await waitFor(() => {
      expect(useAuthStore.getState().token).toBe("jwt-token");
    });
    expect(navigate).toHaveBeenCalledWith("/aprender", { replace: true });
  });
});
