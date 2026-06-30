import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./MainLayout";
import { useAuthStore } from "../stores/authStore";

vi.mock("../services/paymentService", () => ({
  paymentService: {
    getPendingBillId: vi.fn().mockReturnValue(null),
    sync: vi.fn().mockResolvedValue({ id: 1 }),
    clearPendingBillId: vi.fn(),
  },
}));

vi.mock("../services/authService", () => ({
  authService: {
    buscarPerfil: vi.fn(),
  },
}));

vi.mock("../services/settingsService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../services/settingsService")>();
  return {
    ...actual,
    settingsService: {
      ...actual.settingsService,
      getNotificationPreferences: vi.fn().mockResolvedValue(actual.DEFAULT_NOTIFICATION_PREFERENCES),
    },
  };
});

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

describe("MainLayout", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
    useAuthStore.getState().login("token", user);
  });

  it("renderiza sidebar e outlet", () => {
    render(
      <MemoryRouter initialEntries={["/aprender"]}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="aprender" element={<p>Conteúdo aprender</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getAllByText("APRENDER").length).toBeGreaterThan(0);
    expect(screen.getByText("Conteúdo aprender")).toBeInTheDocument();
  });
});
