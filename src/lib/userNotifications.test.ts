import { beforeEach, describe, expect, it, vi } from "vitest";
import { notifyUserMission } from "./userNotifications";
import { useSettingsStore } from "../stores/settingsStore";
import { DEFAULT_NOTIFICATION_PREFERENCES } from "../services/settingsService";

vi.mock("../components/toast/toastBus", () => ({
  toast: { info: vi.fn() },
}));

import { toast } from "../components/toast/toastBus";

describe("userNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSettingsStore.setState({
      notifications: DEFAULT_NOTIFICATION_PREFERENCES,
      loaded: true,
    });
  });

  it("notifyUserMission dispara toast quando permitido", () => {
    notifyUserMission("Missão concluída");
    expect(toast.info).toHaveBeenCalledWith("Missão concluída");
  });

  it("notifyUserMission não dispara toast quando desabilitado", () => {
    useSettingsStore.setState({
      notifications: {
        ...DEFAULT_NOTIFICATION_PREFERENCES,
        disableMissionNotifications: true,
      },
      loaded: true,
    });
    notifyUserMission("Missão concluída");
    expect(toast.info).not.toHaveBeenCalled();
  });
});
