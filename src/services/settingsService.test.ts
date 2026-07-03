import { beforeEach, describe, expect, it, vi } from "vitest";

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  put: vi.fn(),
  post: vi.fn(),
}));

vi.mock("./api", () => ({ default: mockApi }));

import {
  DEFAULT_NOTIFICATION_PREFERENCES,
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
});
