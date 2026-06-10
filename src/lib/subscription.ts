import type { User } from "../stores/authStore";

export function isActiveRoot(user: User | null | undefined): boolean {
  if (!user || user.subscriptionType !== "ROOT") {
    return false;
  }
  if (!user.subscriptionExpiresAt) {
    return true;
  }
  return new Date(user.subscriptionExpiresAt).getTime() > Date.now();
}

export function formatSubscriptionExpiresAt(isoDate: string | null | undefined): string {
  if (!isoDate) {
    return "";
  }
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoDate));
}
