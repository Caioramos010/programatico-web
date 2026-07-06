import api from "./api";
import type { User, NivelHabilidade } from "../stores/authStore";

export interface LoginResponse {
  token: string;
  tipo: string;
  usuario: User;
}

export interface MessageResponse {
  mensagem: string;
}

export interface LoginIniciarResponse {
  requiresVerification: boolean;
  verificationMethod?: "EMAIL";
  mensagem?: string;
  token?: string;
  tipo?: string;
  usuario?: User;
}

export const authService = {
  iniciarLogin: (emailOuUsername: string, senha: string) =>
    api.post<LoginIniciarResponse>("/api/auth/login/iniciar", { emailOuUsername, senha }).then((r) => r.data),

  confirmarLogin: (
    emailOuUsername: string,
    senha: string,
    codigo: string,
    lembrarDispositivo?: boolean
  ) =>
    api
      .post<LoginResponse>("/api/auth/login/confirmar", {
        emailOuUsername,
        senha,
        codigo,
        lembrarDispositivo: lembrarDispositivo ?? false,
      })
      .then((r) => r.data),

  reenviarCodigoLogin: (emailOuUsername: string, senha: string) =>
    api.post<LoginIniciarResponse>("/api/auth/login/reenviar", { emailOuUsername, senha }).then((r) => r.data),

  registro: (data: {
    username: string;
    email: string;
    senha: string;
    idade: number;
  }) =>
    api.post<User>("/api/auth/registro", data).then((r) => r.data),

  // A ativação prova posse do e-mail, então o backend já devolve a sessão logada.
  ativar: (codigo: string, email?: string) =>
    api
      .post<LoginResponse>("/api/auth/ativar", { codigo, ...(email ? { email } : {}) })
      .then((r) => r.data),

  solicitarAtivacao: (email: string) =>
    api.post<MessageResponse>("/api/auth/ativar/solicitar", { email }).then((r) => r.data),

  solicitarRedefinicao: (email: string) =>
    api
      .post<MessageResponse>("/api/auth/redefinir-senha/solicitar", { email })
      .then((r) => r.data),

  novaSenha: (codigo: string, novaSenha: string, email?: string) =>
    api
      .post<MessageResponse>("/api/auth/redefinir-senha/nova", {
        codigo,
        novaSenha,
        ...(email ? { email } : {}),
      })
      .then((r) => r.data),

  buscarPerfil: (id: number) =>
    api.get<User>(`/api/usuarios/${id}`).then((r) => r.data),

  atualizarPerfil: (
    id: number,
    data: { username?: string; email?: string; senha?: string; idade?: number; nivelHabilidade?: NivelHabilidade }
  ) => api.put<User>(`/api/usuarios/${id}`, data).then((r) => r.data),

  solicitarExclusaoConta: (id: number) =>
    api.post<MessageResponse>(`/api/usuarios/${id}/solicitar-exclusao`).then((r) => r.data),

  confirmarExclusaoConta: (id: number, codigo: string) =>
    api.post<void>(`/api/usuarios/${id}/confirmar-exclusao`, { codigo }),
};
