import { afterEach, describe, expect, it, vi } from "vitest";

describe("adminBasePath", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("usa base vazia em subdomínio admin", async () => {
    vi.stubGlobal("location", { hostname: "admin.programatico.com" });
    const mod = await import("./adminBasePath");
    expect(mod.isAdminSubdomain).toBe(true);
    expect(mod.adminBasePath).toBe("");
  });

  it("usa prefixo /admin fora do subdomínio", async () => {
    vi.stubGlobal("location", { hostname: "app.programatico.com" });
    const mod = await import("./adminBasePath");
    expect(mod.isAdminSubdomain).toBe(false);
    expect(mod.adminBasePath).toBe("/admin");
  });

  it("reconhece admin- no hostname", async () => {
    vi.stubGlobal("location", { hostname: "admin-localhost" });
    const mod = await import("./adminBasePath");
    expect(mod.isAdminSubdomain).toBe(true);
  });
});
