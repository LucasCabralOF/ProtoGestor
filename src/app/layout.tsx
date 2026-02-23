import "./globals.css";
import { getLocale, getMessages } from "next-intl/server";
import type { ReactNode } from "react";
import type { AppSettings } from "@/types/base";
import { Providers } from "@/ui/providers/Providers";
import { DEFAULT_THEME, LOCALES, type LocaleKey } from "@/utils/constants";

function isLocaleKey(value: string): value is LocaleKey {
  return (LOCALES as readonly string[]).includes(value);
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const localeRaw = await getLocale();
  const messages = await getMessages();

  const locale: LocaleKey = isLocaleKey(localeRaw) ? localeRaw : "pt-BR";

  const appSettings: AppSettings = {
    theme: DEFAULT_THEME,
    locale,
  };

  const user = null;

  return (
    <html lang={locale}>
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
