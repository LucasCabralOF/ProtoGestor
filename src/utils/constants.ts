// src/utils/constants.ts
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
 * Mantém AntD e CSS alinhados e evita bugs de overlay (Popover/Dropdown/Modal)
 * garantindo colorBgElevated / colorBgSpotlight.
 */
const TOKENS_BASE = {
  // Primary
  colorPrimary: "var(--color-primary)",

  // Text
  colorText: "var(--color-text-1)",
  colorTextBase: "var(--color-text-1)",
  colorTextSecondary: "var(--color-text-2)",
  colorTextDescription: "var(--color-text-2)",

  // Backgrounds (IMPORTANTE p/ popovers)
  colorBgLayout: "var(--color-base-3)", // fundo do app (shell)
  colorBgBase: "var(--color-base-1)", // base surface
  colorBgContainer: "var(--color-base-1)", // cards/containers
  colorBgElevated: "var(--color-base-1)", // popover/dropdown/modal
  colorBgSpotlight: "var(--color-base-1)", // tooltip/spotlight

  // Border / split
  colorBorder: "var(--color-border)",
  colorSplit: "var(--color-border)",

  // Shape / typography
  borderRadius: 12,
  controlHeight: 40,
  fontFamily: "var(--font-sans)",

  // Shadows
  boxShadowSecondary: "0 12px 30px rgba(0,0,0,0.08)",
} satisfies ThemeConfig["token"];

export const THEMES_ANTD: Record<ThemeKey, ThemeConfig> = {
  light: {
    algorithm: theme.defaultAlgorithm,
    token: {
      ...TOKENS_BASE,
      boxShadowSecondary: "0 12px 30px rgba(0,0,0,0.08)",
    },
    // Opcional: travar overlays por componente (ajuda quando algum token escapar)
    components: {
      Popover: { colorBgElevated: "var(--color-base-1)" },
      Dropdown: { colorBgElevated: "var(--color-base-1)" },
      Modal: { colorBgElevated: "var(--color-base-1)" },
      // Algumas versões não tipam colorBgSpotlight aqui; se der erro, remova esta linha.
      Tooltip: { colorBgSpotlight: "var(--color-base-1)" as unknown as string },
    },
  },
  dark: {
    algorithm: theme.darkAlgorithm,
    token: {
      ...TOKENS_BASE,
      boxShadowSecondary: "0 12px 30px rgba(0,0,0,0.35)",
    },
    components: {
      Popover: { colorBgElevated: "var(--color-base-1)" },
      Dropdown: { colorBgElevated: "var(--color-base-1)" },
      Modal: { colorBgElevated: "var(--color-base-1)" },
      Tooltip: { colorBgSpotlight: "var(--color-base-1)" as unknown as string },
    },
  },
} as const;