import { create } from "zustand";
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  type NotificationPreferenceKey,
  type NotificationPreferences,
} from "../services/settingsService";

export type UserNotificationKind =
  | "updates"
  | "daystreak"
  | "missions"
  | "subscription"
  | "email";

const KIND_TO_FIELD: Record<UserNotificationKind, NotificationPreferenceKey> = {
  updates: "disableUpdateNotifications",
  daystreak: "disableDaystreakNotifications",
  missions: "disableMissionNotifications",
  subscription: "disableSubscriptionNotifications",
  email: "disableEmailNotifications",
};

interface SettingsState {
  notifications: NotificationPreferences;
  loaded: boolean;
  setNotifications: (prefs: NotificationPreferences) => void;
  setLoaded: (loaded: boolean) => void;
  canNotify: (kind: UserNotificationKind) => boolean;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  notifications: DEFAULT_NOTIFICATION_PREFERENCES,
  loaded: false,
  setNotifications: (prefs) => set({ notifications: prefs, loaded: true }),
  setLoaded: (loaded) => set({ loaded }),
  canNotify: (kind) => {
    const { notifications } = get();
    if (notifications.disableAllNotifications) {
      return false;
    }
    const field = KIND_TO_FIELD[kind];
    return !notifications[field];
  },
}));
