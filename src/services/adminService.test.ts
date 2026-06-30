import { beforeEach, describe, expect, it, vi } from "vitest";

const mockAdminApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("./adminApi", () => ({ default: mockAdminApi }));

import { adminService } from "./adminService";

describe("adminService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getDashboard busca métricas", async () => {
    mockAdminApi.get.mockResolvedValue({ data: { totalUsers: 10 } });
    await adminService.getDashboard();
    expect(mockAdminApi.get).toHaveBeenCalledWith("/api/admin/dashboard");
  });

  it("listarTrilhas busca trilhas", async () => {
    mockAdminApi.get.mockResolvedValue({ data: [] });
    await adminService.listarTrilhas();
    expect(mockAdminApi.get).toHaveBeenCalledWith("/api/admin/trilhas");
  });

  it("criarTrilha envia POST", async () => {
    mockAdminApi.post.mockResolvedValue({ data: { id: 1, title: "Nova" } });
    await adminService.criarTrilha({ title: "Nova", description: "Desc" });
    expect(mockAdminApi.post).toHaveBeenCalledWith("/api/admin/trilhas", {
      title: "Nova",
      description: "Desc",
    });
  });

  it("listarUsuarios passa busca como param", async () => {
    mockAdminApi.get.mockResolvedValue({ data: [] });
    await adminService.listarUsuarios("ana");
    expect(mockAdminApi.get).toHaveBeenCalledWith("/api/admin/usuarios", { params: { busca: "ana" } });
  });

  it("listarModulos usa trilhaId", async () => {
    mockAdminApi.get.mockResolvedValue({ data: [] });
    await adminService.listarModulos(5);
    expect(mockAdminApi.get).toHaveBeenCalledWith("/api/admin/trilhas/5/modulos");
  });

  it("reordenarModulos envia ids", async () => {
    mockAdminApi.put.mockResolvedValue({ data: undefined });
    await adminService.reordenarModulos(5, [3, 1, 2]);
    expect(mockAdminApi.put).toHaveBeenCalledWith("/api/admin/trilhas/5/modulos/reordenar", {
      ids: [3, 1, 2],
    });
  });

  it("deletarExercicio chama DELETE", async () => {
    mockAdminApi.delete.mockResolvedValue({ data: undefined });
    await adminService.deletarExercicio(9);
    expect(mockAdminApi.delete).toHaveBeenCalledWith("/api/admin/exercises/9");
  });
});
