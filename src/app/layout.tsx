import { getLocale, getMessages } from "next-intl/server";
import type { ReactNode } from "react";
import { Providers } from "@/ui/providers/Providers";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  const appSettings = { theme: "light", locale: locale as any } as const;
  const user = null;

  return (
    <html lang={locale}>
      <body>
        <Providers
          appSettings={appSettings as any}
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
