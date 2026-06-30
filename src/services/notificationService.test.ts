import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  patch: vi.fn(),
}));

vi.mock("./api", () => ({ default: mockApi }));

import {
  mapNotificationResponse,
  mapNotificationResponses,
  notificationService,
} from "./notificationService";

describe("notificationService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-29T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("mapNotificationResponse converte kind e tempo relativo", () => {
    const item = mapNotificationResponse({
      id: 1,
      title: "Missão",
      message: "Concluída",
      kind: "MISSAO",
      read: false,
      createdAt: "2026-06-29T11:30:00Z",
      readAt: null,
    });
    expect(item.id).toBe("1");
    expect(item.kind).toBe("missao");
    expect(item.time).toBe("há 30 minutos");
  });

  it("mapNotificationResponses mapeia lista", () => {
    const items = mapNotificationResponses([
      {
        id: 1,
        title: "A",
        message: "B",
        kind: "TRILHA",
        read: true,
        createdAt: "2026-06-28T12:00:00Z",
        readAt: "2026-06-28T13:00:00Z",
      },
    ]);
    expect(items).toHaveLength(1);
    expect(items[0].kind).toBe("trilha");
  });

  it("getNotifications busca lista", async () => {
    mockApi.get.mockResolvedValue({ data: [] });
    await notificationService.getNotifications();
    expect(mockApi.get).toHaveBeenCalledWith("/api/notificacoes");
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
});
