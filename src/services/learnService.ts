import api from "./api";

export interface ModuloComProgresso {
  id: number;
  titulo: string;
  tipo: "ACTIVITY" | "STUDY";
  ordem: number;
  status: "LOCKED" | "UNLOCKED" | "COMPLETED";
  descricao: string | null;
  totalXp: number;
}

export interface TrilhaResponse {
  id: number;
  titulo: string;
  descricao: string;
  icon: string | null;
  modulos: ModuloComProgresso[];
  percentualConcluido: number;
  totalModulos: number;
  concluidosModulos: number;
}

export interface UserStatsResponse {
  totalXp: number;
  vidasAtuais: number;
  sequenciaAtual: number;
  maxSequencia: number;
}

export interface MissaoResponse {
  missionId: number;
  titulo: string;
  tipo: string;
  progressoAtual: number;
  meta: number;
  recompensaXp: number;
  concluida: boolean;
}

export const learnService = {
  getTrilha: () =>
    api.get<TrilhaResponse>("/api/aprender/trilha").then((r) => r.data),

  getStats: () =>
    api.get<UserStatsResponse>("/api/aprender/stats").then((r) => r.data),

  getMissoes: () =>
    api.get<MissaoResponse[]>("/api/aprender/missoes").then((r) => r.data),
};
