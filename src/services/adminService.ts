import adminApi from "./adminApi";

// ── Types ──────────────────────────────────────────────

export interface Trilha {
  id: number;
  title: string;
  description: string;
  displayOrder: number;
  icon: string | null;
  totalModulos: number;
}

export interface TrilhaRequest {
  title: string;
  description: string;
  icon?: string;
}

export interface Missao {
  id: number;
  title: string;
  objectiveType: string;
  xpReward: number;
  quantidade: number;
}

export interface MissaoRequest {
  title: string;
  objectiveType: string;
  xpReward: number;
  quantidade: number;
}

export interface AdminUsuario {
  id: number;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  ativo: boolean;
  dataCriacao: string;
}

export interface AdminUsuarioUpdate {
  role: "USER" | "ADMIN";
  ativo: boolean;
}

// ── Módulos ───────────────────────────────────────────

export interface Modulo {
  id: number;
  trackId: number;
  title: string;
  moduleType: "ACTIVITY" | "STUDY";
  displayOrder: number;
  description: string | null;
  totalComponentes: number;
  totalXp: number;
}

export interface ModuloRequest {
  title: string;
  moduleType: "ACTIVITY" | "STUDY";
  description?: string;
}

// ── Exercícios ────────────────────────────────────────

export interface Exercise {
  id: number;
  moduloId: number;
  statement: string;
  exerciseType: "PAIRS" | "DRAG_DROP" | "MULTIPLE_CHOICE";
  exerciseData: string;
  xpReward: number;
  tags: string | null;
  imageData: string | null;
}

export interface ExerciseRequest {
  statement: string;
  exerciseType: "PAIRS" | "DRAG_DROP" | "MULTIPLE_CHOICE";
  exerciseData: string;
  xpReward: number;
  tags?: string;
  imageData?: string;
}

// ── Teoria Páginas ────────────────────────────────────

export interface TeoriaPagina {
  id: number;
  moduloId: number;
  title: string;
  description: string | null;
  displayOrder: number;
  totalBlocos: number;
}

export interface TeoriaPaginaRequest {
  title: string;
  description?: string;
}

// ── Content Blocks ────────────────────────────────────

export interface ContentBlock {
  id: number;
  moduloId: number;
  paginaId: number | null;
  layoutType: "TEXT" | "IMAGE" | "CARDS";
  textContent: string | null;
  displayOrder: number;
}

export interface ContentBlockRequest {
  layoutType: "TEXT" | "IMAGE" | "CARDS";
  textContent?: string;
  displayOrder: number;
}

// ── Service ────────────────────────────────────────────

export const adminService = {
  // Trilhas
  listarTrilhas: () =>
    adminApi.get<Trilha[]>("/api/admin/trilhas").then((r) => r.data),

  criarTrilha: (data: TrilhaRequest) =>
    adminApi.post<Trilha>("/api/admin/trilhas", data).then((r) => r.data),

  atualizarTrilha: (id: number, data: TrilhaRequest) =>
    adminApi.put<Trilha>(`/api/admin/trilhas/${id}`, data).then((r) => r.data),

  deletarTrilha: (id: number) =>
    adminApi.delete(`/api/admin/trilhas/${id}`),

  // Missões
  listarMissoes: () =>
    adminApi.get<Missao[]>("/api/admin/missoes").then((r) => r.data),

  criarMissao: (data: MissaoRequest) =>
    adminApi.post<Missao>("/api/admin/missoes", data).then((r) => r.data),

  atualizarMissao: (id: number, data: MissaoRequest) =>
    adminApi.put<Missao>(`/api/admin/missoes/${id}`, data).then((r) => r.data),

  deletarMissao: (id: number) =>
    adminApi.delete(`/api/admin/missoes/${id}`),

  // Usuários
  listarUsuarios: (busca?: string) =>
    adminApi
      .get<AdminUsuario[]>("/api/admin/usuarios", { params: { busca } })
      .then((r) => r.data),

  atualizarUsuario: (id: number, data: AdminUsuarioUpdate) =>
    adminApi
      .put<AdminUsuario>(`/api/admin/usuarios/${id}`, data)
      .then((r) => r.data),

  deletarUsuario: (id: number) =>
    adminApi.delete(`/api/admin/usuarios/${id}`),

  // Módulos
  listarModulos: (trilhaId: number) =>
    adminApi.get<Modulo[]>(`/api/admin/trilhas/${trilhaId}/modulos`).then((r) => r.data),

  criarModulo: (trilhaId: number, data: ModuloRequest) =>
    adminApi.post<Modulo>(`/api/admin/trilhas/${trilhaId}/modulos`, data).then((r) => r.data),

  atualizarModulo: (id: number, data: ModuloRequest) =>
    adminApi.put<Modulo>(`/api/admin/modulos/${id}`, data).then((r) => r.data),

  reordenarModulos: (trilhaId: number, ids: number[]) =>
    adminApi.put(`/api/admin/trilhas/${trilhaId}/modulos/reordenar`, { ids }),

  deletarModulo: (id: number) =>
    adminApi.delete(`/api/admin/modulos/${id}`),

  // Exercícios
  listarExercicios: (moduloId: number) =>
    adminApi.get<Exercise[]>(`/api/admin/modulos/${moduloId}/exercises`).then((r) => r.data),

  criarExercicio: (moduloId: number, data: ExerciseRequest) =>
    adminApi.post<Exercise>(`/api/admin/modulos/${moduloId}/exercises`, data).then((r) => r.data),

  atualizarExercicio: (id: number, data: ExerciseRequest) =>
    adminApi.put<Exercise>(`/api/admin/exercises/${id}`, data).then((r) => r.data),

  deletarExercicio: (id: number) =>
    adminApi.delete(`/api/admin/exercises/${id}`),

  // Teoria Páginas
  listarPaginas: (moduloId: number) =>
    adminApi.get<TeoriaPagina[]>(`/api/admin/modulos/${moduloId}/paginas`).then((r) => r.data),

  criarPagina: (moduloId: number, data: TeoriaPaginaRequest) =>
    adminApi.post<TeoriaPagina>(`/api/admin/modulos/${moduloId}/paginas`, data).then((r) => r.data),

  atualizarPagina: (id: number, data: TeoriaPaginaRequest) =>
    adminApi.put<TeoriaPagina>(`/api/admin/paginas/${id}`, data).then((r) => r.data),

  deletarPagina: (id: number) =>
    adminApi.delete(`/api/admin/paginas/${id}`),

  // Content Blocks
  listarContentBlocks: (moduloId: number) =>
    adminApi.get<ContentBlock[]>(`/api/admin/modulos/${moduloId}/content-blocks`).then((r) => r.data),

  listarContentBlocksPorPagina: (paginaId: number) =>
    adminApi.get<ContentBlock[]>(`/api/admin/paginas/${paginaId}/content-blocks`).then((r) => r.data),

  criarContentBlock: (moduloId: number, data: ContentBlockRequest) =>
    adminApi.post<ContentBlock>(`/api/admin/modulos/${moduloId}/content-blocks`, data).then((r) => r.data),

  criarContentBlockParaPagina: (paginaId: number, data: ContentBlockRequest) =>
    adminApi.post<ContentBlock>(`/api/admin/paginas/${paginaId}/content-blocks`, data).then((r) => r.data),

  atualizarContentBlock: (id: number, data: ContentBlockRequest) =>
    adminApi.put<ContentBlock>(`/api/admin/content-blocks/${id}`, data).then((r) => r.data),

  deletarContentBlock: (id: number) =>
    adminApi.delete(`/api/admin/content-blocks/${id}`),
};
