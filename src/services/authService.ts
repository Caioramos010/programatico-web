import api from "./api";
import type { User } from "../stores/authStore";

export interface LoginResponse {
  token: string;
  tipo: string;
  usuario: User;
}

export interface MessageResponse {
  mensagem: string;
}

export const authService = {
  login: (emailOuUsername: string, senha: string) =>
    api.post<LoginResponse>("/api/auth/login", { emailOuUsername, senha }).then((r) => r.data),

  registro: (data: {
    username: string;
    email: string;
    senha: string;
    idade: number;
  }) =>
    api.post<User>("/api/auth/registro", data).then((r) => r.data),

  ativar: (codigo: string) =>
    api.post<MessageResponse>("/api/auth/ativar", { codigo }).then((r) => r.data),

  solicitarRedefinicao: (email: string) =>
    api
      .post<MessageResponse>("/api/auth/redefinir-senha/solicitar", { email })
      .then((r) => r.data),

  novaSenha: (codigo: string, novaSenha: string) =>
    api
      .post<MessageResponse>("/api/auth/redefinir-senha/nova", { codigo, novaSenha })
      .then((r) => r.data),
};
