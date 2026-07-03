import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import NewPasswordPage from "./NewPasswordPage";

const navigate = vi.fn();
const mockNovaSenha = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => navigate };
});

vi.mock("../services/authService", () => ({
  authService: { novaSenha: mockNovaSenha },
}));

describe("NewPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNovaSenha.mockResolvedValue({ mensagem: "ok" });
  });

  it("redefine senha e vai para sucesso", async () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/redefinir-senha/nova",
            state: { codigo: "123456", email: "user@test.com" },
          },
        ]}
      >
        <Routes>
          <Route path="/redefinir-senha/nova" element={<NewPasswordPage />} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/nova senha/i), {
      target: { value: "NovaSenha@123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirmar senha/i), {
      target: { value: "NovaSenha@123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /redefinir senha/i }));

    await waitFor(() => {
      expect(mockNovaSenha).toHaveBeenCalledWith("123456", "NovaSenha@123", "user@test.com");
    });
    expect(navigate).toHaveBeenCalledWith(
      "/sucesso",
      expect.objectContaining({ replace: true }),
    );
  });
});
