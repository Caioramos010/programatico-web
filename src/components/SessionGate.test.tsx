import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import SessionGate from "./SessionGate";
import { useAuthStore, type User } from "../stores/authStore";
import { isTokenExpired } from "../lib/session";

const mockBuscarPerfil = vi.hoisted(() => vi.fn());

vi.mock("../services/authService", () => ({
  authService: { buscarPerfil: mockBuscarPerfil },
}));

const user: User = {
  id: 1,
  username: "user",
  email: "user@test.com",
  idade: 20,
  ativo: true,
  dataCriacao: "2026-01-01",
  nivelHabilidade: "BEGINNER",
};

function tokenComExp(expEpochSeconds: number): string {
  const payload = btoa(JSON.stringify({ sub: "user", exp: expEpochSeconds }));
  return `header.${payload}.assinatura`;
}

function renderGate() {
  render(
    <SessionGate minDurationMs={0}>
      <p>conteúdo</p>
    </SessionGate>,
  );
}

describe("isTokenExpired", () => {
  it("expira token vencido, malformado ou nulo e aceita token válido", () => {
    expect(isTokenExpired(null)).toBe(true);
    expect(isTokenExpired("abc")).toBe(true);
    expect(isTokenExpired(tokenComExp(Math.floor(Date.now() / 1000) - 60))).toBe(true);
    expect(isTokenExpired(tokenComExp(Math.floor(Date.now() / 1000) + 3600))).toBe(false);
  });
});

describe("SessionGate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().logout();
  });

  it("mostra o splash no boot mesmo sem sessão e depois renderiza", async () => {
    renderGate();

    expect(screen.getByRole("status", { name: /carregando/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("conteúdo")).toBeInTheDocument();
    });
    expect(mockBuscarPerfil).not.toHaveBeenCalled();
  });

  it("respeita a duração mínima do splash", async () => {
    render(
      <SessionGate minDurationMs={150}>
        <p>conteúdo</p>
      </SessionGate>,
    );

    expect(screen.getByRole("status", { name: /carregando/i })).toBeInTheDocument();
    expect(screen.queryByText("conteúdo")).not.toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("conteúdo")).toBeInTheDocument();
    });
  });

  it("limpa a sessão persistida quando o token está expirado (sem flash)", async () => {
    useAuthStore.getState().login(tokenComExp(Math.floor(Date.now() / 1000) - 60), user);

    renderGate();

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
    await waitFor(() => {
      expect(screen.getByText("conteúdo")).toBeInTheDocument();
    });
    expect(mockBuscarPerfil).not.toHaveBeenCalled();
  });

  it("valida na API quando o token ainda vale e atualiza o perfil", async () => {
    useAuthStore.getState().login(tokenComExp(Math.floor(Date.now() / 1000) + 3600), user);
    mockBuscarPerfil.mockResolvedValue({ ...user, username: "user-atualizado" });

    renderGate();

    expect(screen.getByRole("status", { name: /carregando/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("conteúdo")).toBeInTheDocument();
    });
    expect(useAuthStore.getState().user?.username).toBe("user-atualizado");
  });

  it("desloga quando a API rejeita o token", async () => {
    useAuthStore.getState().login(tokenComExp(Math.floor(Date.now() / 1000) + 3600), user);
    mockBuscarPerfil.mockRejectedValue(new Error("401"));

    renderGate();

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
    await waitFor(() => {
      expect(screen.getByText("conteúdo")).toBeInTheDocument();
    });
  });
});
