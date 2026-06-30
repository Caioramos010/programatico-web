import { describe, expect, it } from "vitest";
import { rules } from "./useFormValidation";

describe("useFormValidation rules", () => {
  it("required rejeita valor vazio", () => {
    const rule = rules.required("Nome");
    expect(rule.test("")).toBe(false);
    expect(rule.test("  ")).toBe(false);
    expect(rule.test("Ana")).toBe(true);
  });

  it("email valida formato", () => {
    const rule = rules.email();
    expect(rule.test("invalido")).toBe(false);
    expect(rule.test("user@test.com")).toBe(true);
  });

  it("matches compara com outro campo", () => {
    const rule = rules.matches("senha");
    expect(rule.test("abc", { senha: "abc" })).toBe(true);
    expect(rule.test("xyz", { senha: "abc" })).toBe(false);
  });

  it("strongPassword exige complexidade", () => {
    const rule = rules.strongPassword();
    expect(rule.test("Senha@123")).toBe(true);
    expect(rule.test("senhafraca")).toBe(false);
  });

  it("twoFactorCode aceita 6 dígitos ou backup", () => {
    const rule = rules.twoFactorCode();
    expect(rule.test("123456")).toBe(true);
    expect(rule.test("ABCD-1234")).toBe(true);
    expect(rule.test("12")).toBe(false);
  });

  it("minAge e maxAge validam números", () => {
    expect(rules.minAge(12).test("11")).toBe(false);
    expect(rules.minAge(12).test("12")).toBe(true);
    expect(rules.maxAge(120).test("121")).toBe(false);
  });
});
