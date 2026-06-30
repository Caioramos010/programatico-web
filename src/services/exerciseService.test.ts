import { beforeEach, describe, expect, it, vi } from "vitest";

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock("./api", () => ({ default: mockApi }));

import { exerciseService } from "./exerciseService";

describe("exerciseService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("start inicia sessão do módulo", async () => {
    mockApi.post.mockResolvedValue({ data: { sessionId: 1, exercises: [] } });
    await exerciseService.start(10);
    expect(mockApi.post).toHaveBeenCalledWith("/api/aprender/modulos/10/iniciar");
  });

  it("startPractice usa modo na URL", async () => {
    mockApi.post.mockResolvedValue({ data: { sessionId: 2 } });
    await exerciseService.startPractice("fixacao");
    expect(mockApi.post).toHaveBeenCalledWith("/api/aprender/pratica/fixacao/iniciar");
  });

  it("respond envia exercicioId e resposta", async () => {
    mockApi.post.mockResolvedValue({ data: { correct: true } });
    await exerciseService.respond(5, 99, "resposta");
    expect(mockApi.post).toHaveBeenCalledWith("/api/aprender/sessoes/5/responder", {
      exercicioId: 99,
      resposta: "resposta",
    });
  });

  it("conclude finaliza sessão", async () => {
    mockApi.post.mockResolvedValue({ data: { xpEarned: 50 } });
    await exerciseService.conclude(5);
    expect(mockApi.post).toHaveBeenCalledWith("/api/aprender/sessoes/5/concluir");
  });
});
