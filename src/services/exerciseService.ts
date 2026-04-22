import api from "./api";

export interface SessionExercise {
  id: number;
  order: number;
  statement: string;
  tipo: "DRAG_DROP" | "PAIRS" | "MULTIPLE_CHOICE";
  displayData: string;
  xpReward: number;
  relatedTopics: string[];
  imageData: string | null;
}

export interface StartSessionResponse {
  sessionId: number;
  moduleTitle: string;
  initialLives: number;
  totalExercises: number;
  exercises: SessionExercise[];
}

export interface AnswerResponse {
  correct: boolean;
  correctAnswer: string;
  remainingLives: number;
  relatedTopics: string[];
}

export interface ConclusionResponse {
  xpEarned: number;
  accuracy: number;
  durationSeconds: number;
  remainingLives: number;
  moduleCompleted: boolean;
}

export const exerciseService = {
  start: (moduleId: number) =>
    api.post<StartSessionResponse>(`/api/aprender/modulos/${moduleId}/iniciar`).then((r) => r.data),

  respond: (sessionId: number, exerciseId: number, answer: string) =>
    api
      .post<AnswerResponse>(`/api/aprender/sessoes/${sessionId}/responder`, {
        exercicioId: exerciseId,
        resposta: answer,
      })
      .then((r) => r.data),

  conclude: (sessionId: number) =>
    api.post<ConclusionResponse>(`/api/aprender/sessoes/${sessionId}/concluir`).then((r) => r.data),
};
