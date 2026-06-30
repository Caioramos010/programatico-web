import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("./api", () => ({ default: mockApi }));

import {
  mapNotificationResponse,
  mapNotificationResponses,
  notificationService,
  type NotificationResponse,
} from "./notificationService";

describe("notificationService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-21T14:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("deve mapear notificacao do backend para o formato da interface", () => {
    const notification: NotificationResponse = {
      id: 1,
      title: "Nova trilha desbloqueada",
      message: "Voce desbloqueou mais uma trilha",
      kind: "TRILHA",
      read: false,
      createdAt: "2026-06-21T12:00:00.000Z",
      readAt: null,
    };

    const result = mapNotificationResponse(notification);

    expect(result.id).toBe("1");
    expect(result.title).toBe("Nova trilha desbloqueada");
    expect(result.message).toBe("Voce desbloqueou mais uma trilha");
    expect(result.kind).toBe("trilha");
    expect(result.read).toBe(false);
    expect(result.time).toMatch(/^há \d+ hora/);
  });

  it("deve mapear o tipo MISSAO corretamente", () => {
    const notification: NotificationResponse = {
      id: 2,
      title: "Missao concluida",
      message: "Voce completou a missao diaria",
      kind: "MISSAO",
      read: true,
      createdAt: "2026-06-20T12:00:00.000Z",
      readAt: "2026-06-20T12:10:00.000Z",
    };

    const result = mapNotificationResponse(notification);

    expect(result.kind).toBe("missao");
  });

  it("deve mapear EXERCICIO como tipo padrao", () => {
    const notification: NotificationResponse = {
      id: 3,
      title: "Exercicio concluido",
      message: "Parabens pela atividade",
      kind: "EXERCICIO",
      read: true,
      createdAt: "2026-06-21T13:55:00.000Z",
      readAt: "2026-06-21T14:00:00.000Z",
    };

    const result = mapNotificationResponse(notification);

    expect(result.kind).toBe("exercicio");
    expect(result.time).toMatch(/^há \d+ minuto/);
  });

  it("deve retornar string vazia quando a data for invalida", () => {
    const notification: NotificationResponse = {
      id: 4,
      title: "Notificacao invalida",
      message: "Data incorreta",
      kind: "TRILHA",
      read: false,
      createdAt: "data-invalida",
      readAt: null,
    };

    const result = mapNotificationResponse(notification);

    expect(result.time).toBe("");
  });

  it("deve mapear listas de notificacoes", () => {
    const notifications: NotificationResponse[] = [
      {
        id: 1,
        title: "Nova trilha desbloqueada",
        message: "Voce desbloqueou mais uma trilha",
        kind: "TRILHA",
        read: false,
        createdAt: "2026-06-21T12:00:00.000Z",
        readAt: null,
      },
      {
        id: 2,
        title: "Missao concluida",
        message: "Voce completou a missao diaria",
        kind: "MISSAO",
        read: true,
        createdAt: "2026-06-20T12:00:00.000Z",
        readAt: "2026-06-20T12:10:00.000Z",
      },
    ];

    const result = mapNotificationResponses(notifications);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("1");
    expect(result[1].kind).toBe("missao");
  });

  it("getNotifications busca lista", async () => {
    mockApi.get.mockResolvedValue({ data: [] });
    await notificationService.getNotifications();
    expect(mockApi.get).toHaveBeenCalledWith("/api/notificacoes");
  });

  it("getNotificationById busca notificacao", async () => {
    mockApi.get.mockResolvedValue({ data: { id: 2 } });
    await notificationService.getNotificationById(2);
    expect(mockApi.get).toHaveBeenCalledWith("/api/notificacoes/2");
  });

  it("markAsRead envia PATCH", async () => {
    mockApi.patch.mockResolvedValue({ data: { id: 3, read: true } });
    await notificationService.markAsRead(3);
    expect(mockApi.patch).toHaveBeenCalledWith("/api/notificacoes/3/marcar-como-lida");
  });

  it("markAllAsRead envia PATCH em lote", async () => {
    mockApi.patch.mockResolvedValue({ data: undefined });
    await notificationService.markAllAsRead();
    expect(mockApi.patch).toHaveBeenCalledWith("/api/notificacoes/marcar-todas-como-lidas");
  });

  it("deleteNotification envia DELETE", async () => {
    mockApi.delete.mockResolvedValue({ data: undefined });
    await notificationService.deleteNotification(4);
    expect(mockApi.delete).toHaveBeenCalledWith("/api/notificacoes/4");
  });
});
