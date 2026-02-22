import { create } from "zustand";
import type { AppSettings, User } from "@/types/base";

type AppState = {
  appSettings: AppSettings;
  user: User | null;

  setAppSettings: (appSettings: AppSettings) => void;
  setUser: (user: User | null) => void;
};

export const useAppStore = create<AppState>((set) => ({
  appSettings: {
    theme: "light",
    locale: "pt-BR",
  },
  user: null,

  setAppSettings: (appSettings) => set({ appSettings }),
  setUser: (user) => set({ user }),
}));
