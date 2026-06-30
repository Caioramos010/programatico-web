import { beforeEach, describe, expect, it, vi } from "vitest";

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  put: vi.fn(),
  post: vi.fn(),
}));

vi.mock("./api", () => ({ default: mockApi }));

import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  DEFAULT_SECURITY_PREFERENCES,
  NOTIFICATION_SETTING_OPTIONS,
  settingsService,
} from "./settingsService";

describe("settingsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exporta defaults de notificação", () => {
    expect(DEFAULT_NOTIFICATION_PREFERENCES.disableAllNotifications).toBe(false);
    expect(NOTIFICATION_SETTING_OPTIONS.length).toBeGreaterThan(0);
  });

  it("exporta defaults de segurança", () => {
    expect(DEFAULT_SECURITY_PREFERENCES.twoFactorEnabled).toBe(true);
    expect(DEFAULT_SECURITY_PREFERENCES.totpEnabled).toBe(false);
  });

  it("getNotificationPreferences busca preferências", async () => {
    mockApi.get.mockResolvedValue({ data: DEFAULT_NOTIFICATION_PREFERENCES });
    const result = await settingsService.getNotificationPreferences();
    expect(mockApi.get).toHaveBeenCalledWith("/api/configuracoes/notificacoes");
    expect(result).toEqual(DEFAULT_NOTIFICATION_PREFERENCES);
  });

  it("updateNotificationPreferences envia PUT", async () => {
    mockApi.put.mockResolvedValue({ data: DEFAULT_NOTIFICATION_PREFERENCES });
    await settingsService.updateNotificationPreferences(DEFAULT_NOTIFICATION_PREFERENCES);
    expect(mockApi.put).toHaveBeenCalledWith(
      "/api/configuracoes/notificacoes",
      DEFAULT_NOTIFICATION_PREFERENCES,
    );
  });

  it("setupTotp inicia configuração", async () => {
    mockApi.post.mockResolvedValue({ data: { secret: "ABC", otpauthUrl: "x", qrCodeDataUrl: "y" } });
    await settingsService.setupTotp();
    expect(mockApi.post).toHaveBeenCalledWith("/api/configuracoes/totp/setup");
  });

  it("activateTotp envia código", async () => {
    mockApi.post.mockResolvedValue({ data: { totpEnabled: true, setupPendente: false } });
    await settingsService.activateTotp("123456");
    expect(mockApi.post).toHaveBeenCalledWith("/api/configuracoes/totp/ativar", { codigo: "123456" });
  });
});
