import { beforeEach, describe, expect, it, vi } from "vitest";

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("./api", () => ({ default: mockApi }));

import { authService } from "./authService";

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("iniciarLogin chama endpoint correto", async () => {
    mockApi.post.mockResolvedValue({ data: { requiresVerification: true } });
    const result = await authService.iniciarLogin("user", "senha");
    expect(mockApi.post).toHaveBeenCalledWith("/api/auth/login/iniciar", {
      emailOuUsername: "user",
      senha: "senha",
    });
    expect(result.requiresVerification).toBe(true);
  });

  it("confirmarLogin envia lembrarDispositivo false por padrão", async () => {
    mockApi.post.mockResolvedValue({ data: { token: "t", tipo: "Bearer", usuario: {} } });
    await authService.confirmarLogin("user", "senha", "123456");
    expect(mockApi.post).toHaveBeenCalledWith("/api/auth/login/confirmar", {
      emailOuUsername: "user",
      senha: "senha",
      codigo: "123456",
      lembrarDispositivo: false,
    });
  });

  it("registro envia dados do usuário", async () => {
    const user = { id: 1, username: "ana", email: "a@t.com", idade: 20, ativo: true, dataCriacao: "x" };
    mockApi.post.mockResolvedValue({ data: user });
    const result = await authService.registro({
      username: "ana",
      email: "a@t.com",
      senha: "Senha@123",
      idade: 20,
    });
    expect(mockApi.post).toHaveBeenCalledWith("/api/auth/registro", {
      username: "ana",
      email: "a@t.com",
      senha: "Senha@123",
      idade: 20,
    });
    expect(result).toEqual(user);
  });

  it("ativar inclui email quando informado", async () => {
    mockApi.post.mockResolvedValue({ data: { mensagem: "ok" } });
    await authService.ativar("123456", "a@t.com");
    expect(mockApi.post).toHaveBeenCalledWith("/api/auth/ativar", { codigo: "123456", email: "a@t.com" });
  });

  it("buscarPerfil usa id na URL", async () => {
    mockApi.get.mockResolvedValue({ data: { id: 5 } });
    await authService.buscarPerfil(5);
    expect(mockApi.get).toHaveBeenCalledWith("/api/usuarios/5");
  });
});
