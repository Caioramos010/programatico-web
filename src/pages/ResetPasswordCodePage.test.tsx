import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ResetPasswordCodePage from "./ResetPasswordCodePage";

const navigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => navigate };
});

vi.mock("../services/authService", () => ({
  authService: { solicitarRedefinicao: vi.fn().mockResolvedValue({ mensagem: "ok" }) },
}));

describe("ResetPasswordCodePage", () => {
  it("avança para nova senha com código", () => {
    render(
      <MemoryRouter
        initialEntries={[{ pathname: "/redefinir-senha/codigo", state: { email: "user@test.com" } }]}
      >
        <Routes>
          <Route path="/redefinir-senha/codigo" element={<ResetPasswordCodePage />} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/insira o código/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }));

    expect(navigate).toHaveBeenCalledWith("/redefinir-senha/nova", {
      state: { codigo: "123456", email: "user@test.com" },
    });
  });
});
