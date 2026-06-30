import { describe, expect, it, vi, afterEach } from "vitest";
import { formatSubscriptionExpiresAt, isActiveRoot } from "./subscription";
import type { User } from "../stores/authStore";

const baseUser: User = {
  id: 1,
  username: "user",
  email: "user@test.com",
  idade: 20,
  ativo: true,
  dataCriacao: "2026-01-01",
};

describe("subscription", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("isActiveRoot retorna false para usuário FREE", () => {
    expect(isActiveRoot(baseUser)).toBe(false);
  });

  it("isActiveRoot retorna true para ROOT sem expiração", () => {
    expect(isActiveRoot({ ...baseUser, subscriptionType: "ROOT" })).toBe(true);
  });

  it("isActiveRoot retorna true quando expiração é futura", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-29T12:00:00Z"));
    expect(
      isActiveRoot({
        ...baseUser,
        subscriptionType: "ROOT",
        subscriptionExpiresAt: "2026-07-01T00:00:00.000Z",
      }),
    ).toBe(true);
  });

  it("isActiveRoot retorna false quando expiração passou", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-29T12:00:00Z"));
    expect(
      isActiveRoot({
        ...baseUser,
        subscriptionType: "ROOT",
        subscriptionExpiresAt: "2026-06-01T00:00:00.000Z",
      }),
    ).toBe(false);
  });

  it("formatSubscriptionExpiresAt formata data em pt-BR", () => {
    const formatted = formatSubscriptionExpiresAt("2026-07-15T00:00:00.000Z");
    expect(formatted).toMatch(/julho/i);
    expect(formatted).toMatch(/2026/);
  });

  it("formatSubscriptionExpiresAt retorna vazio sem data", () => {
    expect(formatSubscriptionExpiresAt(null)).toBe("");
    expect(formatSubscriptionExpiresAt(undefined)).toBe("");
  });
});
