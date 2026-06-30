import { describe, expect, it } from "vitest";
import { useSettingsStore } from "./settingsStore";
import { DEFAULT_NOTIFICATION_PREFERENCES } from "../services/settingsService";

describe("settingsStore", () => {
  it("canNotify respeita disableAllNotifications", () => {
    useSettingsStore.setState({
      notifications: { ...DEFAULT_NOTIFICATION_PREFERENCES, disableAllNotifications: true },
      loaded: true,
    });
    expect(useSettingsStore.getState().canNotify("missions")).toBe(false);
  });

  it("canNotify respeita preferência por tipo", () => {
    useSettingsStore.setState({
      notifications: {
        ...DEFAULT_NOTIFICATION_PREFERENCES,
        disableMissionNotifications: true,
      },
      loaded: true,
    });
    expect(useSettingsStore.getState().canNotify("missions")).toBe(false);
    expect(useSettingsStore.getState().canNotify("updates")).toBe(true);
  });
});
