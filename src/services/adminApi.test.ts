import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const logout = vi.fn();
let requestInterceptor: (config: { headers: Record<string, string> }) => {
  headers: Record<string, string>;
};
let responseErrorInterceptor: (error: {
  response?: { status?: number; data?: unknown };
}) => Promise<never>;

vi.mock("../stores/adminAuthStore", () => ({
  useAdminAuthStore: {
    getState: () => ({ token: "admin-jwt", logout }),
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

describe("adminApi interceptors", () => {
  beforeEach(async () => {
    vi.resetModules();
    logout.mockClear();
    Object.defineProperty(window, "location", {
      value: { href: "", hostname: "app.programatico.com" },
      writable: true,
      configurable: true,
    });
    await import("./adminApi");
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("adiciona Authorization com token admin", () => {
    const config = { headers: {} as Record<string, string> };
    const result = requestInterceptor(config);
    expect(result.headers.Authorization).toBe("Bearer admin-jwt");
  });

  it("faz logout e redireciona para /admin/login fora do subdomínio", async () => {
    await expect(
      responseErrorInterceptor({ response: { status: 401, data: {} } }),
    ).rejects.toBeDefined();
    expect(logout).toHaveBeenCalled();
    expect(window.location.href).toBe("/admin/login");
  });

  it("redireciona para /login no subdomínio admin", async () => {
    vi.resetModules();
    Object.defineProperty(window, "location", {
      value: { href: "", hostname: "admin.programatico.com" },
      writable: true,
      configurable: true,
    });
    await import("./adminApi");
    await expect(
      responseErrorInterceptor({ response: { status: 401, data: {} } }),
    ).rejects.toBeDefined();
    expect(window.location.href).toBe("/login");
  });

  it("não trata 403 com mensagem como quebra de auth", async () => {
    logout.mockClear();
    await expect(
      responseErrorInterceptor({
        response: { status: 403, data: { mensagem: "Negado" } },
      }),
    ).rejects.toBeDefined();
    expect(logout).not.toHaveBeenCalled();
  });
});
