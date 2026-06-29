import api from "./api";

export interface NotificationPreferences {
  disableUpdateNotifications: boolean;
  disableDaystreakNotifications: boolean;
  disableMissionNotifications: boolean;
  disableSubscriptionNotifications: boolean;
  disableEmailNotifications: boolean;
  disableAllNotifications: boolean;
}

export interface SecurityPreferences {
  twoFactorEnabled: boolean;
}

export const DEFAULT_SECURITY_PREFERENCES: SecurityPreferences = {
  twoFactorEnabled: true,
};

export type NotificationPreferenceKey = Exclude<
  keyof NotificationPreferences,
  "disableAllNotifications"
>;

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  disableUpdateNotifications: false,
  disableDaystreakNotifications: false,
  disableMissionNotifications: false,
  disableSubscriptionNotifications: false,
  disableEmailNotifications: false,
  disableAllNotifications: false,
};

/** Opções exibidas na tela de configurações (ordem do mock + demais notificações do sistema). */
export const NOTIFICATION_SETTING_OPTIONS: {
  key: NotificationPreferenceKey;
  label: string;
  hint?: string;
}[] = [
  {
    key: "disableUpdateNotifications",
    label: "Desativar notificações de atualizações",
    hint: "Novidades e avisos sobre mudanças na plataforma.",
  },
  {
    key: "disableDaystreakNotifications",
    label: "Desativar notificações de daystreak",
    hint: "Lembretes sobre a sua sequência de dias de estudo.",
  },
  {
    key: "disableMissionNotifications",
    label: "Desativar notificações de missões diárias",
    hint: "Avisos quando você concluir uma missão.",
  },
  {
    key: "disableSubscriptionNotifications",
    label: "Desativar notificações de assinatura",
    hint: "Confirmação quando o plano Root for ativado.",
  },
  {
    key: "disableEmailNotifications",
    label: "Desativar e-mails informativos",
    hint: "Lembretes e novidades por e-mail. Códigos de ativação e senha sempre são enviados.",
  },
];

export const settingsService = {
  getNotificationPreferences: () =>
    api
      .get<NotificationPreferences>("/api/configuracoes/notificacoes")
      .then((r) => r.data),

  updateNotificationPreferences: (data: NotificationPreferences) =>
    api
      .put<NotificationPreferences>("/api/configuracoes/notificacoes", data)
      .then((r) => r.data),

  getSecurityPreferences: () =>
    api.get<SecurityPreferences>("/api/configuracoes/seguranca").then((r) => r.data),

  updateSecurityPreferences: (data: SecurityPreferences) =>
    api.put<SecurityPreferences>("/api/configuracoes/seguranca", data).then((r) => r.data),
};
