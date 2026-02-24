import { AntdRegistry } from "@ant-design/nextjs-registry";
import { NextIntlClientProvider } from "next-intl";
import type { AppSettings, User } from "@/types/base";
import { ClientProviders } from "@/ui/providers/ClientProviders";

export function Providers({
  children,
  appSettings,
  user,
  messages,
  locale,
}: {
  children: React.ReactNode;
  appSettings: AppSettings;
  user: User | null;
  // biome-ignore lint/suspicious/noExplicitAny: ok
  messages: any;
  locale: string;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AntdRegistry>
        <ClientProviders appSettings={appSettings} user={user}>
          {children}
        </ClientProviders>
      </AntdRegistry>
    </NextIntlClientProvider>
  );
}