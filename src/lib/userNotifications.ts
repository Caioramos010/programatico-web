import { toast } from "../components/toast/toastBus";
import type { UserNotificationKind } from "../stores/settingsStore";
import { useSettingsStore } from "../stores/settingsStore";

export function notifyUser(kind: UserNotificationKind, message: string) {
  if (!useSettingsStore.getState().canNotify(kind)) {
    return;
  }
  toast.info(message);
}

export function notifyUserUpdate(message: string) {
  notifyUser("updates", message);
}

export function notifyUserDaystreak(message: string) {
  notifyUser("daystreak", message);
}

export function notifyUserMission(message: string) {
  notifyUser("missions", message);
}

export function notifyUserSubscription(message: string) {
  notifyUser("subscription", message);
}
