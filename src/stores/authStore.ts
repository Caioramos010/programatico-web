import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type NivelHabilidade = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

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
  login: (token: string, user: User) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      updateUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
