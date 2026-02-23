import { type ConfigProviderProps, type ThemeConfig, theme } from "antd";
import enUS from "antd/locale/en_US";
import ptBR from "antd/locale/pt_BR";

// Locales ---------------------------------------------------------------------
export const LOCALES = ["en", "pt-BR"] as const;
export type LocaleKey = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: LocaleKey = "pt-BR";

export const LOCALES_ANTD: Record<LocaleKey, ConfigProviderProps["locale"]> = {
  en: enUS,
  "pt-BR": ptBR,
} as const;

// Themes ----------------------------------------------------------------------
export const THEMES = ["light", "dark"] as const;
export type ThemeKey = (typeof THEMES)[number];

export const DEFAULT_THEME: ThemeKey = "light";

/**
 * Tokens baseados em CSS variables (globals.css).
 * Mantém AntD e CSS alinhados e deixa o visual mais suave/moderno.
 */
const TOKENS_BASE = {
  colorPrimary: "var(--color-primary)",
  colorTextBase: "var(--color-text-1)",
  colorTextSecondary: "var(--color-text-2)",

  colorBgBase: "var(--color-base-4)",
  colorBgContainer: "var(--color-base-4)",
  colorBgLayout: "var(--color-base-3)",

  colorBorder: "var(--color-border)",

  borderRadius: 12,
  controlHeight: 40,
  fontFamily: "var(--font-sans)",
  boxShadowSecondary: "0 12px 30px rgba(0,0,0,0.08)",
} satisfies ThemeConfig["token"];

export const THEMES_ANTD: Record<ThemeKey, ThemeConfig> = {
  light: {
    algorithm: theme.defaultAlgorithm,
    token: {
      ...TOKENS_BASE,
      boxShadowSecondary: "0 12px 30px rgba(0,0,0,0.08)",
    },
  },
  dark: {
    algorithm: theme.darkAlgorithm,
    token: {
      ...TOKENS_BASE,
      boxShadowSecondary: "0 12px 30px rgba(0,0,0,0.35)",
    },
  },
} as const;
