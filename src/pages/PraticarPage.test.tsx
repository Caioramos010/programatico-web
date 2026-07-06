import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PraticarPage from "./PraticarPage";
import { useAuthStore, type User } from "../stores/authStore";

const navigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => navigate };
});

const baseUser: User = {
  id: 1,
  username: "user",
  email: "user@test.com",
  idade: 25,
  ativo: true,
  dataCriacao: "2026-01-01",
  nivelHabilidade: "BEGINNER",
};

function renderPage() {
  render(
    <MemoryRouter>
      <PraticarPage />
    </MemoryRouter>,
  );
}

describe("PraticarPage", () => {
  beforeEach(() => {
    navigate.mockClear();
    useAuthStore.getState().logout();
  });

  it("usuário livre vê badge Root e é levado ao seja-root nos modos exclusivos", () => {
    useAuthStore.getState().login("token", baseUser);
    renderPage();

    expect(screen.getAllByText("Root")).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: /erros/i }));
    expect(navigate).toHaveBeenCalledWith("/seja-root");
  });

  it("usuário livre acessa o modo cronometrado normalmente", () => {
    useAuthStore.getState().login("token", baseUser);
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: /cronometrado/i }));
    expect(navigate).toHaveBeenCalledWith("/praticar/cronometrado");
  });

  it("assinante Root acessa erros e fixação sem badge", () => {
    useAuthStore.getState().login("token", {
      ...baseUser,
      subscriptionType: "ROOT",
      subscriptionExpiresAt: new Date(Date.now() + 86400000).toISOString(),
    });
    renderPage();

    expect(screen.queryByText("Root")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /erros/i }));
    expect(navigate).toHaveBeenCalledWith("/praticar/erros");
  });
});
