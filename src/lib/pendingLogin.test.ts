import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearPendingLogin,
  loadPendingLogin,
  savePendingLogin,
} from "./pendingLogin";

describe("pendingLogin", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("salva e carrega estado pendente", () => {
    savePendingLogin({
      emailOuUsername: "user@test.com",
      senha: "Senha@123",
      from: "/perfil",
      verificationMethod: "TOTP",
    });

    const loaded = loadPendingLogin();
    expect(loaded?.emailOuUsername).toBe("user@test.com");
    expect(loaded?.from).toBe("/perfil");
    expect(loaded?.verificationMethod).toBe("TOTP");
  });

  it("retorna null quando storage vazio", () => {
    expect(loadPendingLogin()).toBeNull();
  });

  it("clearPendingLogin remove dados", () => {
    savePendingLogin({ emailOuUsername: "a", senha: "b" });
    clearPendingLogin();
    expect(loadPendingLogin()).toBeNull();
  });

  it("retorna null para JSON inválido", () => {
    sessionStorage.setItem("pendingLogin", "{invalid");
    expect(loadPendingLogin()).toBeNull();
  });
});
