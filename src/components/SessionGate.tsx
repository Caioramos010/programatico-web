import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { authService } from "../services/authService";
import { isTokenExpired } from "../lib/session";
import LoadingScreen from "./LoadingScreen";

/**
 * Valida a sessão persistida no localStorage ANTES de renderizar as rotas.
 * Sem isso, um token velho/expirado deixava `isAuthenticated: true` e o
 * GuestRoute redirecionava por um instante para a tela logada ("flash") até a
 * API responder 401. Sessão inválida é limpa na hora; enquanto a validação
 * roda, mostra a tela de carregamento.
 */
export default function SessionGate({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(() => useAuthStore.getState().isAuthenticated);

  useEffect(() => {
    const { token, user, isAuthenticated, logout, updateUser } = useAuthStore.getState();
    if (!isAuthenticated) {
      return;
    }
    if (!user || isTokenExpired(token)) {
      logout();
      setChecking(false);
      return;
    }
    // Token dentro da validade: confirma com a API (pega revogação/usuário
    // removido) e aproveita para atualizar o perfil em cache.
    authService
      .buscarPerfil(user.id)
      .then((atualizado) => updateUser(atualizado))
      .catch(() => useAuthStore.getState().logout())
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return <LoadingScreen />;
  }
  return <>{children}</>;
}
