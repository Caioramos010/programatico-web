import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuthStore } from "../stores/authStore";

const user = {
  id: 1,
  username: "aluno",
  email: "aluno@test.com",
  idade: 18,
  ativo: true,
  dataCriacao: "2026-01-01",
  nivelHabilidade: "BEGINNER" as const,
  subscriptionType: "FREE" as const,
};

describe("Sidebar", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
    useAuthStore.getState().login("token", user);
  });

  it("renderiza links principais", () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );

    expect(screen.getAllByText("APRENDER").length).toBeGreaterThan(0);
    expect(screen.getAllByText("PRATICAR").length).toBeGreaterThan(0);
    expect(screen.getAllByText("SEJA ROOT").length).toBeGreaterThan(0);
  });
});
