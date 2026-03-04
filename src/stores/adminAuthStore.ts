import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AdminAuthState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: "admin-auth",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
