const PENDING_LOGIN_KEY = "pendingLogin";

export type PendingLoginState = {
  emailOuUsername: string;
  senha: string;
  from?: string;
};

export function savePendingLogin(state: PendingLoginState) {
  sessionStorage.setItem(PENDING_LOGIN_KEY, JSON.stringify(state));
}

export function loadPendingLogin(): PendingLoginState | null {
  try {
    const raw = sessionStorage.getItem(PENDING_LOGIN_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingLoginState;
  } catch {
    return null;
  }
}

export function clearPendingLogin() {
  sessionStorage.removeItem(PENDING_LOGIN_KEY);
}
