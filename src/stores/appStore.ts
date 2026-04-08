import { create } from "zustand";
import type { AppSettings, User } from "@/types/base";
import {
  DEFAULT_LOCALE,
  DEFAULT_THEME,
  type LocaleKey,
  type ThemeKey,
} from "@/utils/constants";

type AppState = {
  appSettings: AppSettings;
  user: User | null;
  setAppSettings: (next: AppSettings) => void;
  setLocale: (locale: LocaleKey) => void;
  setTheme: (theme: ThemeKey) => void;
  setUser: (user: User | null) => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  appSettings: {
    theme: DEFAULT_THEME,
    locale: DEFAULT_LOCALE,
  },
  user: null,

  setAppSettings: (next) => set({ appSettings: next }),
  setLocale: (locale) => set({ appSettings: { ...get().appSettings, locale } }),
  setTheme: (theme) => set({ appSettings: { ...get().appSettings, theme } }),

  setUser: (user) => set({ user }),
}));
