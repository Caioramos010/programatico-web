import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { useAuthStore } from "../stores/authStore";

const userWithLevel = {
  id: 1,
  username: "user",
  email: "user@test.com",
  idade: 20,
  ativo: true,
  dataCriacao: "2026-01-01",
  nivelHabilidade: "BEGINNER" as const,
};

describe("ProtectedRoute", () => {
  it("redireciona para login quando não autenticado", () => {
    useAuthStore.getState().logout();

    render(
      <MemoryRouter initialEntries={["/aprender"]}>
        <Routes>
          <Route path="/login" element={<div>Página login</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/aprender" element={<div>Conteúdo</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Página login")).toBeInTheDocument();
  });

  it("redireciona para onboarding sem nível", () => {
    useAuthStore.getState().login("token", { ...userWithLevel, nivelHabilidade: null });

    render(
      <MemoryRouter initialEntries={["/aprender"]}>
        <Routes>
          <Route path="/onboarding" element={<div>Onboarding</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/aprender" element={<div>Conteúdo</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Onboarding")).toBeInTheDocument();
  });

  it("renderiza conteúdo quando autenticado com nível", () => {
    useAuthStore.getState().login("token", userWithLevel);

    render(
      <MemoryRouter initialEntries={["/aprender"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/aprender" element={<div>Conteúdo protegido</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Conteúdo protegido")).toBeInTheDocument();
  });
});
