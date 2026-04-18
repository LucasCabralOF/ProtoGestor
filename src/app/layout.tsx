import "./globals.css";
import { cookies } from "next/headers";
import { getLocale, getMessages } from "next-intl/server";
import type { ReactNode } from "react";
import type { AppSettings } from "@/types/base";
import { Providers } from "@/ui/providers/Providers";
import {
  DEFAULT_LOCALE,
  DEFAULT_THEME,
  LOCALES,
  type LocaleKey,
  THEMES,
  type ThemeKey,
} from "@/utils/constants";

function isLocaleKey(v: string): v is LocaleKey {
  return (LOCALES as readonly string[]).includes(v);
}
function isThemeKey(v: string): v is ThemeKey {
  return (THEMES as readonly string[]).includes(v);
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  let localeRaw = DEFAULT_LOCALE;
  let messages = {};

  try {
    localeRaw = await getLocale() as LocaleKey;
    messages = await getMessages();
  } catch (_err) {
    // Ignore error to prevent crashing, fallback to defaults
  }

  const cookieStore = await cookies();

  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value ?? localeRaw;
  const locale: LocaleKey = isLocaleKey(cookieLocale)
    ? cookieLocale
    : DEFAULT_LOCALE;

  const cookieTheme = cookieStore.get("APP_THEME")?.value ?? DEFAULT_THEME;
  const theme: ThemeKey = isThemeKey(cookieTheme) ? cookieTheme : DEFAULT_THEME;

  const appSettings: AppSettings = { theme, locale };
  const user = null;

  return (
    <html lang={locale} className={theme === "dark" ? "dark" : ""}>
      <body>
        <Providers
          appSettings={appSettings}
          user={user}
          locale={locale}
          messages={messages}
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
