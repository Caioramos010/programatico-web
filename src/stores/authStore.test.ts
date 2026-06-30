import { describe, expect, it } from "vitest";
import { useAuthStore } from "./authStore";

const sampleUser = {
  id: 1,
  username: "user",
  email: "user@test.com",
  idade: 20,
  ativo: true,
  dataCriacao: "2026-01-01",
  nivelHabilidade: "BEGINNER" as const,
};

describe("authStore", () => {
  it("login define token e usuário autenticado", () => {
    useAuthStore.getState().logout();
    useAuthStore.getState().login("token-abc", sampleUser);

    const state = useAuthStore.getState();
    expect(state.token).toBe("token-abc");
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.username).toBe("user");
  });

  it("logout limpa sessão", () => {
    useAuthStore.getState().login("token-abc", sampleUser);
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it("updateUser substitui usuário mantendo token", () => {
    useAuthStore.getState().login("token-abc", sampleUser);
    useAuthStore.getState().updateUser({ ...sampleUser, username: "novo" });

    expect(useAuthStore.getState().token).toBe("token-abc");
    expect(useAuthStore.getState().user?.username).toBe("novo");
  });
});
