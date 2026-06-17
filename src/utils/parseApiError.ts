import axios from "axios";

/**
 * Parsed result from an API error response.
 * - `fieldErrors`: maps field names to messages (from `{ erros: { campo: msg } }`)
 * - `formError`:   general message to show at the form level (from `{ mensagem: msg }`)
 */
export type ParsedApiError = {
  fieldErrors?: Record<string, string>;
  formError?: string;
};

/**
 * Parses an axios error into a structured shape that matches the backend's
 * GlobalExceptionHandler response format:
 *
 *   Validation   → { mensagem: "Dados inválidos", erros: { campo: "msg" } }
 *   BadRequest   → { mensagem: "..." }
 *   Network/etc  → formError fallback
 */
export function parseApiError(error: unknown): ParsedApiError {
  if (!axios.isAxiosError(error)) {
    return { formError: "Erro inesperado. Tente novamente." };
  }

  if (!error.response) {
    return { formError: "Erro de conexão. Verifique sua internet." };
  }

  const data = error.response.data as Record<string, unknown> | undefined;

  if (!data) {
    return { formError: "Erro inesperado. Tente novamente." };
  }

  const result: ParsedApiError = {};

  if (data.erros && typeof data.erros === "object") {
    result.fieldErrors = data.erros as Record<string, string>;
  }

  if (typeof data.mensagem === "string") {
    result.formError = data.mensagem;
  } else if (error.response.status === 401 || error.response.status === 403) {
    result.formError = "Sessão expirada. Faça login novamente.";
  } else if (error.response.status >= 500) {
    result.formError = "Erro no servidor. Tente novamente em instantes.";
  }

  if (!result.formError && !result.fieldErrors) {
    result.formError = "Erro inesperado. Tente novamente.";
  }

  return result;
}
