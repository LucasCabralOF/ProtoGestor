import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { AbstractIntlMessages } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import type { AppSettings, User } from "@/types/base";
import { ClientProviders } from "@/ui/providers/ClientProviders";
import { LOCALES_ANTD } from "@/utils/constants";

export function Providers({
  children,
  appSettings,
  user,
  locale,
  messages,
}: {
  children: React.ReactNode;
  appSettings: AppSettings;
  user: User | null;
  locale: string;
  messages: AbstractIntlMessages;
}) {
  const appLocale = LOCALES_ANTD[appSettings.locale];

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AntdRegistry>
        <ClientProviders
          appSettings={appSettings}
          locale={appLocale}
          user={user}
        >
          {children}
        </ClientProviders>
      </AntdRegistry>
    </NextIntlClientProvider>
  );
}
