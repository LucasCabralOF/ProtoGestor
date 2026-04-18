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
  "marketing",
  "navigation",
  "onboarding",
  "projects",
  "reports",
  "schedule",
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
      try {
        const module = await import(`../locales/${locale}/${namespace}.json`);
        return [namespace, module.default] as const;
      } catch (_err) {
        // Fallback to empty object to prevent crashing
        return [namespace, {}] as const;
      }
    }),
  );

  return Object.fromEntries(entries) as Record<AppNamespace, unknown>;
}

export default getRequestConfig(async () => {
  const locale = await resolveLocale();

  try {
    const messages = await getMessagesForLocale(locale);
    return { locale, messages };
  } catch (err) {
    console.error("[getRequestConfig] Error loading messages:", err);
    return { locale, messages: {} };
  }
});
