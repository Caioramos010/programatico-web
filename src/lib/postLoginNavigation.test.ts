import { describe, expect, it } from "vitest";
import { resolvePostLoginPath } from "./postLoginNavigation";
import type { User } from "../stores/authStore";

const baseUser: User = {
  id: 1,
  username: "user",
  email: "user@test.com",
  idade: 20,
  ativo: true,
  dataCriacao: "2026-01-01",
};

describe("resolvePostLoginPath", () => {
  it("redireciona para onboarding quando usuário não tem nível", () => {
    expect(resolvePostLoginPath(baseUser)).toBe("/onboarding");
  });

  it("redireciona para aprender quando usuário tem nível", () => {
    const user = { ...baseUser, nivelHabilidade: "BEGINNER" as const };
    expect(resolvePostLoginPath(user)).toBe("/aprender");
  });

  it("usa rota de origem quando usuário tem nível e from informado", () => {
    const user = { ...baseUser, nivelHabilidade: "INTERMEDIATE" as const };
    expect(resolvePostLoginPath(user, "/perfil")).toBe("/perfil");
  });

  it("ignora from quando usuário ainda não completou onboarding", () => {
    expect(resolvePostLoginPath(baseUser, "/perfil")).toBe("/onboarding");
  });
});
