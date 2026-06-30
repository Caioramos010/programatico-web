import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ActivationPage from "./ActivationPage";

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
  });

  it("ativa conta e redireciona para sucesso", async () => {
    mockAtivar.mockResolvedValue({ mensagem: "Conta ativada" });

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
    expect(navigate).toHaveBeenCalledWith(
      "/sucesso",
      expect.objectContaining({
        replace: true,
        state: expect.objectContaining({ title: "Conta ativada" }),
      }),
    );
  });
});
