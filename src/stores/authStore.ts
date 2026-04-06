import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  id: number;
  username: string;
  email: string;
  idade: number;
  ativo: boolean;
  dataCriacao: string;
  role?: string;
  icon?: string | null;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
  login: (token: string, user: User) => void;
  completeOnboarding: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      onboardingCompleted: false,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      completeOnboarding: () => set({ onboardingCompleted: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false, onboardingCompleted: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
