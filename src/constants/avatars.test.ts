import { describe, expect, it } from "vitest";
import { DEFAULT_AVATARS, avatarUrl } from "./avatars";

describe("avatars", () => {
  it("DEFAULT_AVATARS contém arquivos esperados", () => {
    expect(DEFAULT_AVATARS.length).toBeGreaterThan(0);
    expect(DEFAULT_AVATARS).toContain("gina.png");
  });

  it("avatarUrl monta caminho público", () => {
    expect(avatarUrl("gina.png")).toBe("/avatars/gina.png");
  });
});
