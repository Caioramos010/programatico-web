import { beforeEach, describe, expect, it, vi } from "vitest";

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  put: vi.fn(),
  post: vi.fn(),
}));

vi.mock("./api", () => ({ default: mockApi }));

import { usuarioService } from "./usuarioService";

describe("usuarioService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("buscar usa id na URL", async () => {
    mockApi.get.mockResolvedValue({ data: { id: 4 } });
    await usuarioService.buscar(4);
    expect(mockApi.get).toHaveBeenCalledWith("/api/usuarios/4");
  });

  it("atualizar envia PUT", async () => {
    mockApi.put.mockResolvedValue({ data: { id: 4, username: "novo" } });
    await usuarioService.atualizar(4, { username: "novo" });
    expect(mockApi.put).toHaveBeenCalledWith("/api/usuarios/4", { username: "novo" });
  });

  it("solicitarExclusao chama POST", async () => {
    mockApi.post.mockResolvedValue({ data: { mensagem: "ok" } });
    await usuarioService.solicitarExclusao(4);
    expect(mockApi.post).toHaveBeenCalledWith("/api/usuarios/4/solicitar-exclusao");
  });

  it("confirmarExclusao envia código", async () => {
    mockApi.post.mockResolvedValue({ data: undefined });
    await usuarioService.confirmarExclusao(4, "123456");
    expect(mockApi.post).toHaveBeenCalledWith("/api/usuarios/4/confirmar-exclusao", { codigo: "123456" });
  });
});
