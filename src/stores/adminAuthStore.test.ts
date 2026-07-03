import { beforeEach, describe, expect, it } from "vitest";
import { useAdminAuthStore } from "./adminAuthStore";

describe("adminAuthStore", () => {
  beforeEach(() => {
    sessionStorage.clear();
    useAdminAuthStore.setState({
      isAuthenticated: false,
      token: null,
      user: null,
    });
  });

  it("login define token e usuário admin", () => {
    useAdminAuthStore.getState().login("admin-token", {
      id: 1,
      username: "admin",
      email: "admin@test.com",
      role: "ADMIN",
    });

    const state = useAdminAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe("admin-token");
    expect(state.user?.role).toBe("ADMIN");
  });

  it("logout limpa sessão admin", () => {
    useAdminAuthStore.getState().login("admin-token", {
      id: 1,
      username: "admin",
      email: "admin@test.com",
      role: "ADMIN",
    });
    useAdminAuthStore.getState().logout();

    const state = useAdminAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });
});
