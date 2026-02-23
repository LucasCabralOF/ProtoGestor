import "./globals.css";
import { getLocale, getMessages } from "next-intl/server";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { Providers } from "@/ui/providers/Providers";
import type { AppSettings } from "@/types/base";
import { DEFAULT_LOCALE, DEFAULT_THEME, LOCALES, THEMES, type LocaleKey, type ThemeKey } from "@/utils/constants";

function isLocaleKey(v: string): v is LocaleKey {
  return (LOCALES as readonly string[]).includes(v);
}
function isThemeKey(v: string): v is ThemeKey {
  return (THEMES as readonly string[]).includes(v);
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const localeRaw = await getLocale();
  const messages = await getMessages();

  const cookieStore = await cookies();

  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value ?? localeRaw;
  const locale: LocaleKey = isLocaleKey(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  const cookieTheme = cookieStore.get("APP_THEME")?.value ?? DEFAULT_THEME;
  const theme: ThemeKey = isThemeKey(cookieTheme) ? cookieTheme : DEFAULT_THEME;

  const appSettings: AppSettings = { theme, locale };
  const user = null;

  return (
    <html lang={locale}>
      <body>
        <Providers appSettings={appSettings} user={user} locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}