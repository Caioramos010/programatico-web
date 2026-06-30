import type { User } from "../stores/authStore";

export function resolvePostLoginPath(user: User, from?: string): string {
  const fallback = user.nivelHabilidade ? "/aprender" : "/onboarding";
  return user.nivelHabilidade && from ? from : fallback;
}
