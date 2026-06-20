import api from "./api";

export interface NotificationResponse {
  id: number;
  title: string;
  message: string;
  kind: "TRILHA" | "EXERCICIO" | "MISSAO";
  read: boolean;
  createdAt: string;
  readAt: string | null;
}

export type NotificationKind = "trilha" | "exercicio" | "missao";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  kind: NotificationKind;
  read: boolean;
}

function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();

  if (Number.isNaN(date.getTime()) || diffMs < 0) {
    return "";
  }

  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  if (diffMs < hourMs) {
    const minutes = Math.max(1, Math.floor(diffMs / minuteMs));
    return `há ${minutes} minuto${minutes > 1 ? "s" : ""}`;
  }

  if (diffMs < dayMs) {
    const hours = Math.floor(diffMs / hourMs);
    return `há ${hours} hora${hours > 1 ? "s" : ""}`;
  }

  const days = Math.floor(diffMs / dayMs);
  return `há ${days} dia${days > 1 ? "s" : ""}`;
}

function mapNotificationKind(kind: NotificationResponse["kind"]): NotificationKind {
  if (kind === "TRILHA") return "trilha";
  if (kind === "MISSAO") return "missao";
  return "exercicio";
}

export function mapNotificationResponse(notification: NotificationResponse): NotificationItem {
  return {
    id: String(notification.id),
    title: notification.title,
    message: notification.message,
    time: formatRelativeTime(notification.createdAt),
    kind: mapNotificationKind(notification.kind),
    read: notification.read,
  };
}

export function mapNotificationResponses(notifications: NotificationResponse[]): NotificationItem[] {
  return notifications.map(mapNotificationResponse);
}

export const notificationService = {
  getNotifications: () =>
    api.get<NotificationResponse[]>("/api/notificacoes").then((r) => r.data),

  getNotificationById: (id: number) =>
    api.get<NotificationResponse>(`/api/notificacoes/${id}`).then((r) => r.data),

  markAsRead: (id: number) =>
    api.patch<NotificationResponse>(`/api/notificacoes/${id}/marcar-como-lida`).then((r) => r.data),

  markAllAsRead: () =>
    api.patch<void>("/api/notificacoes/marcar-todas-como-lidas").then((r) => r.data),

  deleteNotification: (id: number) =>
    api.delete<void>(`/api/notificacoes/${id}`).then((r) => r.data),
};
