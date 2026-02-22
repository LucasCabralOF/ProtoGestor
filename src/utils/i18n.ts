import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export const locales = ["pt-BR", "en"] as const;
export const defaultLocale = "pt-BR";

type AppLocale = (typeof locales)[number];

async function resolveLocale(): Promise<AppLocale> {
  const jar = await cookies();
  const cookieLocale = jar.get("NEXT_LOCALE")?.value;

  if (cookieLocale && locales.includes(cookieLocale as any)) {
    return cookieLocale as AppLocale;
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
