import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignUpPage from "./SignUpPage";

const navigate = vi.fn();
const mockRegistro = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

vi.mock("../services/authService", () => ({
  authService: {
    registro: mockRegistro,
  },
}));

describe("SignUpPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("cria conta e redireciona para ativação", async () => {
    mockRegistro.mockResolvedValue({ id: 1, email: "novo@email.com" });

    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/nome de usuário/i), {
      target: { value: "novo_user" },
    });
    fireEvent.change(screen.getByPlaceholderText(/^e-mail$/i), {
      target: { value: "novo@email.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/^senha$/i), {
      target: { value: "Senha@123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/idade/i), {
      target: { value: "20" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => {
      expect(mockRegistro).toHaveBeenCalledWith({
        username: "novo_user",
        email: "novo@email.com",
        senha: "Senha@123",
        idade: 20,
      });
    });
    expect(sessionStorage.getItem("pendingActivationEmail")).toBe("novo@email.com");
    expect(navigate).toHaveBeenCalledWith("/ativacao", {
      state: { email: "novo@email.com" },
    });
  });

  it("mantém botão desabilitado sem aceitar termos", () => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: /criar conta/i })).toBeDisabled();
  });
});
