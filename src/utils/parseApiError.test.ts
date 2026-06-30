import { describe, expect, it } from "vitest";
import axios, { AxiosError } from "axios";
import { parseApiError } from "./parseApiError";

describe("parseApiError", () => {
  it("retorna erro de conexão quando não há response", () => {
    const error = new AxiosError("Network Error");
    const result = parseApiError(error);
    expect(result.formError).toBe("Erro de conexão. Verifique sua internet.");
  });

  it("extrai erros de campo e mensagem de validação", () => {
    const error = new AxiosError("Bad Request", "ERR_BAD_REQUEST", undefined, undefined, {
      status: 400,
      statusText: "Bad Request",
      data: { mensagem: "Dados inválidos", erros: { nome: "Nome é obrigatório" } },
      headers: {},
      config: {} as never,
    });
    const result = parseApiError(error);
    expect(result.formError).toBe("Dados inválidos");
    expect(result.fieldErrors?.nome).toBe("Nome é obrigatório");
  });

  it("retorna mensagem de sessão expirada para 401", () => {
    const error = new AxiosError("Unauthorized", "ERR_BAD_REQUEST", undefined, undefined, {
      status: 401,
      statusText: "Unauthorized",
      data: {},
      headers: {},
      config: {} as never,
    });
    const result = parseApiError(error);
    expect(result.formError).toBe("Sessão expirada. Faça login novamente.");
  });

  it("retorna fallback para erros não axios", () => {
    expect(parseApiError(new Error("x")).formError).toBe(
      "Erro inesperado. Tente novamente.",
    );
  });
});
