import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export const locales = ["pt-BR", "en"] as const;
export const defaultLocale = "pt-BR";

type AppLocale = (typeof locales)[number];

function isAppLocale(locale: string): locale is AppLocale {
  return locales.includes(locale as AppLocale);
}

async function resolveLocale(): Promise<AppLocale> {
  const jar = await cookies();
  const cookieLocale = jar.get("NEXT_LOCALE")?.value;

  if (cookieLocale && isAppLocale(cookieLocale)) {
    return cookieLocale;
  }

  return defaultLocale;
}

export default getRequestConfig(async () => {
  const locale = await resolveLocale();

  const common = (await import(`../locales/${locale}/common.json`)).default;

  return {
    locale,
    messages: { common },
  };
});
