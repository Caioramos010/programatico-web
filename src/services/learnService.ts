import api from "./api";

export interface ModuleWithProgress {
  id: number;
  title: string;
  type: "ACTIVITY" | "STUDY";
  order: number;
  status: "LOCKED" | "UNLOCKED" | "COMPLETED";
  description: string | null;
  totalXp: number;
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

export const learnService = {
  getTrack: () =>
    api.get<TrackResponse>("/api/aprender/trilha").then((r) => r.data),

  getStats: () =>
    api.get<UserStatsResponse>("/api/aprender/stats").then((r) => r.data),

  getMissions: () =>
    api.get<MissionResponse[]>("/api/aprender/missoes").then((r) => r.data),
};
