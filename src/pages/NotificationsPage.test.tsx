import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotificationsPage from "./NotificationsPage";

const mockGetNotifications = vi.hoisted(() => vi.fn());

vi.mock("../services/notificationService", async () => {
  const actual = await vi.importActual<typeof import("../services/notificationService")>(
    "../services/notificationService",
  );
  return {
    ...actual,
    notificationService: {
      ...actual.notificationService,
      getNotifications: mockGetNotifications,
      markAsRead: vi.fn(),
      markAllAsRead: vi.fn(),
    },
  };
});

describe("NotificationsPage", () => {
  beforeEach(() => {
    mockGetNotifications.mockResolvedValue([]);
  });

  it("renderiza título", async () => {
    render(
      <MemoryRouter>
        <NotificationsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Notificações")).toBeInTheDocument();
    });
  });
});
