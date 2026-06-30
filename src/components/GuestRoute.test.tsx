import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import GuestRoute from "./GuestRoute";
import { useAuthStore } from "../stores/authStore";

describe("GuestRoute", () => {
  it("renderiza filhos quando não autenticado", () => {
    useAuthStore.getState().logout();

    render(
      <MemoryRouter>
        <GuestRoute>
          <div>Login page</div>
        </GuestRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("redireciona usuário autenticado para aprender", () => {
    useAuthStore.getState().login("token", {
      id: 1,
      username: "user",
      email: "user@test.com",
      idade: 20,
      ativo: true,
      dataCriacao: "2026-01-01",
      nivelHabilidade: "BEGINNER",
    });

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/aprender" element={<div>Aprender</div>} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <div>Login page</div>
              </GuestRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Aprender")).toBeInTheDocument();
  });
});
