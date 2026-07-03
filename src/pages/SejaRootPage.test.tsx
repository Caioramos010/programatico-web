import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SejaRootPage from "./SejaRootPage";
import { useAuthStore } from "../stores/authStore";

describe("SejaRootPage", () => {
  beforeEach(() => {
    useAuthStore.getState().login("token", {
      id: 1,
      username: "freeuser",
      email: "free@test.com",
      idade: 20,
      ativo: true,
      dataCriacao: "2026-01-01",
      nivelHabilidade: "BEGINNER",
      subscriptionType: "FREE",
    });
  });

  it("renderiza proposta root", () => {
    render(
      <MemoryRouter>
        <SejaRootPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/seja root agora/i)).toBeInTheDocument();
  });
});
