import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SettingsPage from "./SettingsPage";

const mockGetNotificationPreferences = vi.hoisted(() => vi.fn());

vi.mock("../services/settingsService", async () => {
  const actual = await vi.importActual<typeof import("../services/settingsService")>(
    "../services/settingsService",
  );
  return {
    ...actual,
    settingsService: {
      ...actual.settingsService,
      getNotificationPreferences: mockGetNotificationPreferences,
      updateNotificationPreferences: vi.fn(),
    },
  };
});

describe("SettingsPage", () => {
  beforeEach(() => {
    mockGetNotificationPreferences.mockResolvedValue({
      disableAllNotifications: false,
      disableDaystreakNotifications: false,
      disableEmailNotifications: false,
      disableMissionNotifications: false,
      disableSubscriptionNotifications: false,
      disableUpdateNotifications: false,
    });
  });

  it("carrega preferências", async () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Configurações")).toBeInTheDocument();
    });
  });
});
