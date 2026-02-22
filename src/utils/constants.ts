import { type ConfigProviderProps, type ThemeConfig, theme } from "antd";
import enUS from "antd/locale/en_US";
import ptBR from "antd/locale/pt_BR";

// Auth ------------------------------------------------------------------------
export const ROLES = ["admin", "user", "guest"] as const;

export const PERMISSIONS = ["are", "arsh", "scbr2d", "scbr3d"] as const;

// Locales ---------------------------------------------------------------------
export const LOCALES = ["en", "pt-BR"] as const;
export const DEFAULT_LOCALE = "pt-BR";

export const LOCALES_ANTD: Record<string, ConfigProviderProps["locale"]> = {
  en: enUS,
  "pt-BR": ptBR,
} as const;

// Themes ----------------------------------------------------------------------
export const THEMES = ["light", "dark"] as const;
export const DEFAULT_THEME = "light";

export const THEMES_ANTD: Record<string, ThemeConfig> = {
  dark: {
    algorithm: theme.darkAlgorithm,
    token: {
      colorBgBase: "#000000",
      colorPrimary: "#1677ff",
      colorTextBase: "#fafafa",
      fontFamily: "Fira Code",
    },
  },
  light: {
    algorithm: theme.defaultAlgorithm,
    token: {
      colorBgBase: "#ffffff",
      colorPrimary: "#1677ff",
      colorTextBase: "#1e1e1e",
      fontFamily: "Fira Code",
    },
  },
} as const;
