import api from "./api";
import type { User } from "../stores/authStore";

export interface UpdateUsuarioRequest {
  username?: string;
  email?: string;
  senha?: string;
  icon?: string;
}

export const usuarioService = {
  buscar: (id: number) =>
    api.get<User>(`/api/usuarios/${id}`).then((r) => r.data),

  atualizar: (id: number, data: UpdateUsuarioRequest) =>
    api.put<User>(`/api/usuarios/${id}`, data).then((r) => r.data),

  solicitarExclusao: (id: number) =>
    api.post<{ mensagem: string }>(`/api/usuarios/${id}/solicitar-exclusao`).then((r) => r.data),

  confirmarExclusao: (id: number, codigo: string) =>
    api.post(`/api/usuarios/${id}/confirmar-exclusao`, { codigo }),
};
