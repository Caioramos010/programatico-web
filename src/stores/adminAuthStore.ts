import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AdminAuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: AdminUser | null;
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      login: (token, user) => set({ isAuthenticated: true, token, user }),
      logout: () => set({ isAuthenticated: false, token: null, user: null }),
    }),
    {
      name: "admin-auth",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
