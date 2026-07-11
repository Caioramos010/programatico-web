/**
 * Verifica localmente se um JWT está expirado (claim `exp`), sem chamada de
 * rede. Token nulo, malformado ou sem exp legível é tratado como expirado —
 * melhor pedir login de novo do que confiar numa sessão quebrada.
 */
export function isTokenExpired(token: string | null | undefined): boolean {
  if (!token) return true;
  const parts = token.split(".");
  if (parts.length !== 3) return true;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (typeof payload.exp !== "number") return true;
    return payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}
