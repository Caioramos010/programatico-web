import api from "./api";

export interface ModuleWithProgress {
  id: number;
  title: string;
  type: "ACTIVITY" | "STUDY";
  order: number;
  status: "LOCKED" | "UNLOCKED" | "COMPLETED";
  description: string | null;
  totalXp: number;
  /** Assuntos mais frequentes do módulo (só preenchido para usuários Root). */
  topAssuntos: string[];
}

export interface TrackResponse {
  id: number;
  title: string;
  description: string;
  icon: string | null;
  modules: ModuleWithProgress[];
  completedPercentage: number;
  totalModules: number;
  completedModules: number;
}

export interface UserStatsResponse {
  totalXp: number;
  currentLives: number;
  maxLives: number;
  /** Segundos até a próxima vida; null quando as vidas estão cheias ou são ilimitadas. */
  secondsUntilNextLife: number | null;
  secondsPerLife: number;
  unlimitedLives: boolean;
  currentStreak: number;
  maxStreak: number;
}

export interface MissionResponse {
  missionId: number;
  title: string;
  type: string;
  currentProgress: number;
  goal: number;
  xpReward: number;
  completed: boolean;
}

export interface TheoryBlock {
  id: number;
  layoutType: "TEXT" | "IMAGE" | "CARDS";
  textContent: string | null;
  imageUrl: string | null;
  order: number;
}

export interface TheoryPage {
  id: number;
  title: string;
  description: string | null;
  order: number;
  blocks: TheoryBlock[];
}

export interface TheoryResponse {
  moduleId: number;
  moduleTitle: string;
  pages: TheoryPage[];
}

export const learnService = {
  getTrack: () =>
    api.get<TrackResponse>("/api/aprender/trilha").then((r) => r.data),

  getStats: () =>
    api.get<UserStatsResponse>("/api/aprender/stats").then((r) => r.data),

  getMissions: () =>
    api.get<MissionResponse[]>("/api/aprender/missoes").then((r) => r.data),

  getTheory: (moduleId: number) =>
    api.get<TheoryResponse>(`/api/aprender/modulos/${moduleId}/teorico`).then((r) => r.data),

  finishTheory: (moduleId: number) =>
    api
      .post<{ firstCompletion: boolean; completedMissions: string[] }>(
        `/api/aprender/modulos/${moduleId}/teorico/concluir`,
      )
      .then((r) => r.data),
};
