import api from "./api";

export interface ReviewTrackOption {
  id: number;
  title: string;
}

export interface ReviewStat {
  title: string;
  value: string;
  subtitle: string;
}

export interface ReviewPerformancePoint {
  day: string;
  acertos: number;
  erros: number;
}

export interface ReviewSubjectAccuracyItem {
  assunto: string;
  percentual: number;
  color: string;
}

export interface ReviewErrorBySubjectItem {
  assunto: string;
  erros: number;
}

export interface ReviewNowItem {
  assunto: string;
}

export interface ReviewRecentMissionItem {
  label: string;
  status: string;
}

export interface ReviewResponse {
  selectedTrackId: number | null;
  selectedDays: number;
  currentXp: number;
  availableTracks: ReviewTrackOption[];
  stats: ReviewStat[];
  performanceData: ReviewPerformancePoint[];
  subjectAccuracy: ReviewSubjectAccuracyItem[];
  errorsBySubject: ReviewErrorBySubjectItem[];
  reviewNow: ReviewNowItem[];
  recentMissions: ReviewRecentMissionItem[];
}

export const reviewService = {
  getReview: (params?: { trackId?: number; days?: number }) =>
    api.get<ReviewResponse>("/api/review", { params }).then((r) => r.data),
};
