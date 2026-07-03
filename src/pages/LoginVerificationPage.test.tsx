import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import LoginVerificationPage from "./LoginVerificationPage";
import { useAuthStore } from "../stores/authStore";

const navigate = vi.fn();
const mockConfirmarLogin = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

vi.mock("../services/authService", () => ({
  authService: {
    confirmarLogin: mockConfirmarLogin,
    reenviarCodigoLogin: vi.fn(),
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

const pendingState = {
  emailOuUsername: "user@test.com",
  senha: "Senha@123",
};

function renderPage() {
  return render(
    <MemoryRouter
      initialEntries={[{ pathname: "/login/verificacao", state: pendingState }]}
    >
      <Routes>
        <Route path="/login/verificacao" element={<LoginVerificationPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("LoginVerificationPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().logout();
    sessionStorage.clear();
  });

  it("confirma login com código e lembrar dispositivo", async () => {
    mockConfirmarLogin.mockResolvedValue({
      token: "jwt-2fa",
      usuario: sampleUser,
    });

    renderPage();

    fireEvent.change(screen.getByPlaceholderText(/código do e-mail/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /^entrar$/i }));

    await waitFor(() => {
      expect(mockConfirmarLogin).toHaveBeenCalledWith(
        "user@test.com",
        "Senha@123",
        "123456",
        true,
      );
    });
    expect(useAuthStore.getState().token).toBe("jwt-2fa");
    expect(navigate).toHaveBeenCalledWith("/aprender", { replace: true });
  });
});
