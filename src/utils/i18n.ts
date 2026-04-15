import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export const locales = ["pt-BR", "en"] as const;
export const defaultLocale = "pt-BR";
export const namespaces = [
  "auth",
  "clients",
  "common",
  "dashboard",
  "errors",
  "navigation",
  "projects",
  "reports",
  "services",
  "settings",
] as const;

export type AppLocale = (typeof locales)[number];
export type AppNamespace = (typeof namespaces)[number];

export function isAppLocale(locale: string): locale is AppLocale {
  return locales.includes(locale as AppLocale);
}

export async function resolveLocale(): Promise<AppLocale> {
  const jar = await cookies();
  const cookieLocale = jar.get("NEXT_LOCALE")?.value;

  if (cookieLocale && isAppLocale(cookieLocale)) {
    return cookieLocale;
  }

  return defaultLocale;
}

export async function getMessagesForLocale(
  locale: AppLocale,
  targetNamespaces: readonly AppNamespace[] = namespaces,
) {
  const entries = await Promise.all(
    targetNamespaces.map(async (namespace) => {
      const module = await import(`../locales/${locale}/${namespace}.json`);
      return [namespace, module.default] as const;
    }),
  );

  return Object.fromEntries(entries) as Record<AppNamespace, unknown>;
}

export default getRequestConfig(async () => {
  const locale = await resolveLocale();

  return {
    locale,
    messages: await getMessagesForLocale(locale),
  };
});
