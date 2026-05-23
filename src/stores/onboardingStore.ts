import { create } from "zustand";

type Level = "beginner" | "intermediate" | "advanced";

interface OnboardingState {
  level: Level | null;
  setLevel: (n: Level) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()((set) => ({
  level: null,
  setLevel: (level) => set({ level }),
  reset: () => set({ level: null }),
}));
