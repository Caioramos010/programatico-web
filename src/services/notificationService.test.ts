import {
  mapNotificationResponse,
  mapNotificationResponses,
  type NotificationResponse,
} from "./notificationService";

describe("notificationService", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-21T14:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("deve mapear notificacao do backend para o formato da interface", () => {
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

  test("deve mapear o tipo MISSAO corretamente", () => {
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

  test("deve mapear EXERCICIO como tipo padrao", () => {
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

  test("deve retornar string vazia quando a data for invalida", () => {
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

  test("deve mapear listas de notificacoes", () => {
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
});
