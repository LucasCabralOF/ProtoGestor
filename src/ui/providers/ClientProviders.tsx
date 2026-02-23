"use client";

import { App, ConfigProvider, type ConfigProviderProps } from "antd";
import { useEffect, useMemo, useState } from "react";
import { IconContext } from "react-icons";
import { useAppStore } from "@/stores/appStore";
import type { AppSettings, User } from "@/types/base";
import { THEMES_ANTD } from "@/utils/constants";

export function ClientProviders({
  children,
  appSettings,
  locale,
  user,
}: {
  children: React.ReactNode;
  appSettings: AppSettings;
  locale: ConfigProviderProps["locale"];
  user: User | null;
}) {
  const storeSettings = useAppStore((s) => s.appSettings);
  const setAppSettings = useAppStore((s) => s.setAppSettings);
  const setUser = useAppStore((s) => s.setUser);

  // evita re-hidratar o store em toda render
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!hydrated) {
      setAppSettings(appSettings);
      setUser(user);
      setHydrated(true);
      return;
    }

    // user pode mudar por navegação/sessão
    setUser(user);
  }, [hydrated, appSettings, user, setAppSettings, setUser]);

  // fonte da verdade depois de hidratado: STORE
  const effectiveSettings = hydrated ? storeSettings : appSettings;

  const theme = useMemo(() => THEMES_ANTD[effectiveSettings.theme], [effectiveSettings.theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (effectiveSettings.theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    // mantém cookie de idioma sincronizado (já funciona)
    document.cookie = `NEXT_LOCALE=${encodeURIComponent(effectiveSettings.locale)}; Path=/; Max-Age=${60 * 60 * 24 * 365}`;
    // persistir tema também:
    document.cookie = `APP_THEME=${encodeURIComponent(effectiveSettings.theme)}; Path=/; Max-Age=${60 * 60 * 24 * 365}`;
  }, [effectiveSettings.theme, effectiveSettings.locale]);

  return (
    <ConfigProvider locale={locale} theme={theme}>
      <App className="flex size-full flex-col">
        <IconContext.Provider value={{ size: "18" }}>{children}</IconContext.Provider>
      </App>
    </ConfigProvider>
  );
}