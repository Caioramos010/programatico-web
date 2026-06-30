import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { rules, useFormValidation } from "./useFormValidation";

const schema = {
  email: [rules.required("E-mail"), rules.email()],
  senha: [rules.required("Senha"), rules.minLength(6, "Senha")],
};

describe("useFormValidation hook", () => {
  it("validate retorna false e preenche erros", () => {
    const { result } = renderHook(() => useFormValidation(schema));

    let valid = false;
    act(() => {
      valid = result.current.validate({ email: "", senha: "123" });
    });

    expect(valid).toBe(false);
    expect(result.current.fieldError("email")).toBe("E-mail é obrigatório.");
    expect(result.current.fieldError("senha")).toBe("Senha deve ter no mínimo 6 caracteres.");
    expect(result.current.submitted).toBe(true);
  });

  it("validate retorna true com dados válidos", () => {
    const { result } = renderHook(() => useFormValidation(schema));

    let valid = false;
    act(() => {
      valid = result.current.validate({ email: "a@b.com", senha: "123456" });
    });

    expect(valid).toBe(true);
    expect(result.current.fieldError("email")).toBe("");
  });

  it("onBlur valida campo tocado", () => {
    const { result } = renderHook(() => useFormValidation(schema));

    act(() => {
      result.current.onBlur("email", "invalido", { email: "invalido", senha: "" });
    });

    expect(result.current.fieldError("email")).toBe("E-mail inválido.");
  });

  it("onChange limpa erro após correção quando tocado", () => {
    const { result } = renderHook(() => useFormValidation(schema));

    act(() => {
      result.current.onBlur("email", "x", { email: "x", senha: "" });
    });
    act(() => {
      result.current.onChange("email", "ok@test.com", { email: "ok@test.com", senha: "" });
    });

    expect(result.current.fieldError("email")).toBe("");
  });

  it("setServerErrors marca campos do backend", () => {
    const { result } = renderHook(() => useFormValidation(schema));

    act(() => {
      result.current.setServerErrors({ email: "E-mail já cadastrado." });
    });

    expect(result.current.fieldError("email")).toBe("E-mail já cadastrado.");
  });

  it("reset limpa estado", () => {
    const { result } = renderHook(() => useFormValidation(schema));

    act(() => {
      result.current.validate({ email: "", senha: "" });
      result.current.setFormError("Erro geral");
      result.current.reset();
    });

    expect(result.current.fieldError("email")).toBe("");
    expect(result.current.submitted).toBe(false);
    expect(result.current.formError).toBe("");
  });
});
