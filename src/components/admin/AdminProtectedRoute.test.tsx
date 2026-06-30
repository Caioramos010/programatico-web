import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AdminProtectedRoute from "./AdminProtectedRoute";
import { useAdminAuthStore } from "../../stores/adminAuthStore";

describe("AdminProtectedRoute", () => {
  beforeEach(() => {
    sessionStorage.clear();
    useAdminAuthStore.getState().logout();
    Object.defineProperty(window, "location", {
      value: { hostname: "app.programatico.com" },
      writable: true,
      configurable: true,
    });
  });

  it("redireciona para /admin/login quando não autenticado", () => {
    render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <Routes>
          <Route path="/admin/login" element={<div>Login admin</div>} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <div>Painel</div>
              </AdminProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Login admin")).toBeInTheDocument();
  });

  it("renderiza conteúdo quando autenticado", () => {
    useAdminAuthStore.getState().login("token", {
      id: 1,
      username: "admin",
      email: "admin@test.com",
      role: "ADMIN",
    });

    render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <Routes>
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <div>Painel admin</div>
              </AdminProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Painel admin")).toBeInTheDocument();
  });

  it("redireciona para /login no subdomínio admin", async () => {
    vi.resetModules();
    Object.defineProperty(window, "location", {
      value: { hostname: "admin.programatico.com" },
      writable: true,
      configurable: true,
    });
    const { default: AdminRoute } = await import("./AdminProtectedRoute");

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/login" element={<div>Login subdomínio</div>} />
          <Route
            path="/dashboard"
            element={
              <AdminRoute>
                <div>Painel</div>
              </AdminRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Login subdomínio")).toBeInTheDocument();
  });
});
