import { beforeEach, describe, expect, it, vi } from "vitest";

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock("./api", () => ({ default: mockApi }));

import { learnService } from "./learnService";

describe("learnService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getTrack busca trilha", async () => {
    const track = { id: 1, title: "Trilha", modules: [] };
    mockApi.get.mockResolvedValue({ data: track });
    const result = await learnService.getTrack();
    expect(mockApi.get).toHaveBeenCalledWith("/api/aprender/trilha");
    expect(result).toEqual(track);
  });

  it("getStats busca estatísticas", async () => {
    mockApi.get.mockResolvedValue({ data: { totalXp: 100 } });
    await learnService.getStats();
    expect(mockApi.get).toHaveBeenCalledWith("/api/aprender/stats");
  });

  it("getTheory usa moduleId na URL", async () => {
    mockApi.get.mockResolvedValue({ data: { moduleId: 3, pages: [] } });
    await learnService.getTheory(3);
    expect(mockApi.get).toHaveBeenCalledWith("/api/aprender/modulos/3/teorico");
  });

  it("finishTheory conclui módulo teórico", async () => {
    mockApi.post.mockResolvedValue({ data: undefined });
    await learnService.finishTheory(7);
    expect(mockApi.post).toHaveBeenCalledWith("/api/aprender/modulos/7/teorico/concluir");
  });
});
