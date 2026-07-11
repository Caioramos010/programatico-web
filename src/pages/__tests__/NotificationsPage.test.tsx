import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotificationsPage from "../NotificationsPage";
import { notificationService } from "../../services/notificationService";

vi.mock("../../services/notificationService", async () => {
  const actual = await vi.importActual<typeof import("../../services/notificationService")>(
    "../../services/notificationService",
  );

  return {
    ...actual,
    notificationService: {
      getNotifications: vi.fn(),
      getNotificationById: vi.fn(),
      markAsRead: vi.fn(),
      markAllAsRead: vi.fn(),
      deleteNotification: vi.fn(),
    },
  };
});

const mockedNotificationService = vi.mocked(notificationService);

describe("NotificationsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("deve carregar e exibir notificacoes com contadores corretos", async () => {
    mockedNotificationService.getNotifications.mockResolvedValue([
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
        title: "Exercicio concluido",
        message: "Parabens pela atividade",
        kind: "EXERCICIO",
        read: true,
        createdAt: "2026-06-21T11:00:00.000Z",
        readAt: "2026-06-21T11:05:00.000Z",
      },
    ]);

    render(<NotificationsPage />);

    expect(screen.getByRole("status", { name: /carregando/i })).toBeInTheDocument();

    expect(await screen.findByText("Nova trilha desbloqueada")).toBeInTheDocument();
    expect(screen.getByText("Exercicio concluido")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^TODAS \(2\)$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^NÃO LIDAS \(1\)$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^LIDAS \(1\)$/i })).toBeInTheDocument();
  });

  test("deve filtrar notificacoes por status e por texto", async () => {
    const user = userEvent.setup();

    mockedNotificationService.getNotifications.mockResolvedValue([
      {
        id: 1,
        title: "Nova trilha desbloqueada",
        message: "Conteudo novo liberado",
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
        createdAt: "2026-06-21T11:00:00.000Z",
        readAt: "2026-06-21T11:05:00.000Z",
      },
    ]);

    render(<NotificationsPage />);

    expect(await screen.findByText("Nova trilha desbloqueada")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^LIDAS \(1\)$/i }));

    await waitFor(() => {
      expect(screen.queryByText("Nova trilha desbloqueada")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Missao concluida")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^TODAS \(2\)$/i }));
    await user.type(screen.getByRole("textbox", { name: /Buscar notificação/i }), "trilha");

    await waitFor(() => {
      expect(screen.getByText("Nova trilha desbloqueada")).toBeInTheDocument();
    });
    expect(screen.queryByText("Missao concluida")).not.toBeInTheDocument();
  });

  test("deve marcar uma notificacao como lida e atualizar a interface", async () => {
    const user = userEvent.setup();

    mockedNotificationService.getNotifications.mockResolvedValue([
      {
        id: 1,
        title: "Nova trilha desbloqueada",
        message: "Voce desbloqueou mais uma trilha",
        kind: "TRILHA",
        read: false,
        createdAt: "2026-06-21T12:00:00.000Z",
        readAt: null,
      },
    ]);

    mockedNotificationService.markAsRead.mockResolvedValue({
      id: 1,
      title: "Nova trilha desbloqueada",
      message: "Voce desbloqueou mais uma trilha",
      kind: "TRILHA",
      read: true,
      createdAt: "2026-06-21T12:00:00.000Z",
      readAt: "2026-06-21T12:05:00.000Z",
    });

    render(<NotificationsPage />);

    expect(await screen.findByText("Nova trilha desbloqueada")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Marcar como lida/i }));

    await waitFor(() => {
      expect(mockedNotificationService.markAsRead).toHaveBeenCalledWith(1);
    });

    expect(screen.getByRole("button", { name: "Lida" })).toBeDisabled();
    expect(screen.getByRole("button", { name: /^NÃO LIDAS \(0\)$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^LIDAS \(1\)$/i })).toBeInTheDocument();
  });

  test("deve marcar todas como lidas", async () => {
    const user = userEvent.setup();

    mockedNotificationService.getNotifications.mockResolvedValue([
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
        read: false,
        createdAt: "2026-06-21T11:00:00.000Z",
        readAt: null,
      },
    ]);

    mockedNotificationService.markAllAsRead.mockResolvedValue(undefined);

    render(<NotificationsPage />);

    expect(await screen.findByText("Nova trilha desbloqueada")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Marcar todas como lidas/i }));

    await waitFor(() => {
      expect(mockedNotificationService.markAllAsRead).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByRole("button", { name: /^NÃO LIDAS \(0\)$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^LIDAS \(2\)$/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Lida" })).toHaveLength(2);
  });

  test("deve excluir uma notificacao da lista", async () => {
    const user = userEvent.setup();

    mockedNotificationService.getNotifications.mockResolvedValue([
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
        createdAt: "2026-06-21T11:00:00.000Z",
        readAt: "2026-06-21T11:05:00.000Z",
      },
    ]);

    mockedNotificationService.deleteNotification.mockResolvedValue(undefined);

    render(<NotificationsPage />);

    expect(await screen.findByText("Nova trilha desbloqueada")).toBeInTheDocument();
    expect(screen.getByText("Missao concluida")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Excluir notificação Nova trilha desbloqueada/i }));

    await waitFor(() => {
      expect(mockedNotificationService.deleteNotification).toHaveBeenCalledWith(1);
    });

    expect(screen.queryByText("Nova trilha desbloqueada")).not.toBeInTheDocument();
    expect(screen.getByText("Missao concluida")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^TODAS \(1\)$/i })).toBeInTheDocument();
  });
});
