import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RootPage from "./RootPage";
import { useAuthStore } from "../stores/authStore";

describe("RootPage", () => {
  beforeEach(() => {
    useAuthStore.getState().login("token", {
      id: 1,
      username: "rootuser",
      email: "root@test.com",
      idade: 25,
      ativo: true,
      dataCriacao: "2026-01-01",
      nivelHabilidade: "BEGINNER",
      subscriptionType: "ROOT",
      subscriptionExpiresAt: new Date(Date.now() + 86400000).toISOString(),
      subscriptionAutoRenew: true,
    });
  });

  it("renderiza status root para assinante", () => {
    render(
      <MemoryRouter>
        <RootPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Você é Root")).toBeInTheDocument();
  });
});
