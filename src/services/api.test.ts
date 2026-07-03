import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const logout = vi.fn();
let requestInterceptor: (config: { headers: Record<string, string>; url?: string }) => {
  headers: Record<string, string>;
  url?: string;
};
let responseErrorInterceptor: (error: {
  config?: { url?: string };
  response?: { status?: number; data?: unknown };
}) => Promise<never>;

vi.mock("../stores/authStore", () => ({
  useAuthStore: {
    getState: () => ({ token: "jwt-token", logout }),
  },
}));

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: {
          use: vi.fn((fn: typeof requestInterceptor) => {
            requestInterceptor = fn;
          }),
        },
        response: {
          use: vi.fn((_ok: unknown, err: typeof responseErrorInterceptor) => {
            responseErrorInterceptor = err;
          }),
        },
      },
    })),
  },
}));

describe("api interceptors", () => {
  beforeEach(async () => {
    vi.resetModules();
    logout.mockClear();
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
      configurable: true,
    });
    await import("./api");
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("adiciona Authorization quando há token", () => {
    const config = { headers: {} as Record<string, string> };
    const result = requestInterceptor(config);
    expect(result.headers.Authorization).toBe("Bearer jwt-token");
  });

  it("faz logout e redireciona em 401 fora de rotas auth", async () => {
    await expect(
      responseErrorInterceptor({
        config: { url: "/api/aprender/trilha" },
        response: { status: 401, data: {} },
      }),
    ).rejects.toBeDefined();
    expect(logout).toHaveBeenCalled();
    expect(window.location.href).toBe("/login");
  });

  it("não faz logout em 401 em rota auth", async () => {
    logout.mockClear();
    await expect(
      responseErrorInterceptor({
        config: { url: "/api/auth/login/iniciar" },
        response: { status: 401, data: {} },
      }),
    ).rejects.toBeDefined();
    expect(logout).not.toHaveBeenCalled();
  });

  it("faz logout em 403 mesmo com mensagem no body", async () => {
    logout.mockClear();
    window.location.href = "";
    await expect(
      responseErrorInterceptor({
        config: { url: "/api/admin/x" },
        response: { status: 403, data: { mensagem: "Sem permissão" } },
      }),
    ).rejects.toBeDefined();
    expect(logout).toHaveBeenCalled();
    expect(window.location.href).toBe("/login");
  });
});
