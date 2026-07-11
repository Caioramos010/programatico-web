import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { authService } from "../services/authService";
import { isTokenExpired } from "../lib/session";
import LoadingScreen from "./LoadingScreen";

/** Duração mínima do splash — casa com a animação da barra (2,4s). */
export const SPLASH_MIN_MS = 2500;

/**
 * Splash de abertura do app: roda em TODO carregamento inicial por pelo menos
 * {@link SPLASH_MIN_MS}, enquanto (1) limpa caches transientes do navegador e
 * (2) valida a sessão persistida (exp local do JWT + confirmação na API).
 * Sessão inválida é limpa do localStorage antes de qualquer rota renderizar —
 * elimina o flash de tela logada com token vencido.
 */
export default function SessionGate({
  children,
  minDurationMs = SPLASH_MIN_MS,
}: {
  children: React.ReactNode;
  minDurationMs?: number;
}) {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const inicio = Date.now();
    let timeoutId: number | undefined;
    const finalizar = () => {
      const restante = Math.max(0, minDurationMs - (Date.now() - inicio));
      timeoutId = window.setTimeout(() => setChecking(false), restante);
    };

    void limparCachesTransientes();

    const { token, user, isAuthenticated, logout, updateUser } = useAuthStore.getState();
    if (!isAuthenticated) {
      finalizar();
    } else if (!user || isTokenExpired(token)) {
      logout();
      finalizar();
    } else {
      // Token dentro da validade: confirma com a API (pega revogação/usuário
      // removido) e aproveita para atualizar o perfil em cache.
      authService
        .buscarPerfil(user.id)
        .then((atualizado) => updateUser(atualizado))
        .catch(() => useAuthStore.getState().logout())
        .finally(finalizar);
    }

    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checking) {
    return <LoadingScreen />;
  }
  return <>{children}</>;
}

/**
 * Limpeza de melhor esforço dos caches do navegador (Cache API) — garante que
 * um deploy novo não conviva com respostas velhas em cache. A sessão válida no
 * localStorage NÃO é tocada aqui; sessão inválida é tratada pela validação.
 */
async function limparCachesTransientes(): Promise<void> {
  try {
    if ("caches" in window) {
      const chaves = await window.caches.keys();
      await Promise.all(chaves.map((chave) => window.caches.delete(chave)));
    }
  } catch {
    // Sem suporte ou bloqueado — segue sem limpar.
  }
}
