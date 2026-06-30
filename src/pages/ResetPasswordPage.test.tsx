import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ResetPasswordPage from "./ResetPasswordPage";

const navigate = vi.fn();
const mockSolicitar = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => navigate };
});

vi.mock("../services/authService", () => ({
  authService: { solicitarRedefinicao: mockSolicitar },
}));

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSolicitar.mockResolvedValue({ mensagem: "ok" });
  });

  it("envia e-mail e navega para código", async () => {
    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/^e-mail$/i), {
      target: { value: "user@test.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /enviar código/i }));

    await waitFor(() => {
      expect(mockSolicitar).toHaveBeenCalledWith("user@test.com");
    });
    expect(navigate).toHaveBeenCalledWith("/redefinir-senha/codigo", {
      state: { email: "user@test.com" },
    });
  });
});
