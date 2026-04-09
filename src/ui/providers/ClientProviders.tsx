"use client";

import { App, ConfigProvider, type ConfigProviderProps } from "antd";
import { useEffect, useMemo, useRef } from "react";
import { IconContext } from "react-icons";
import { useAppStore } from "@/stores/appStore";
import type { AppSettings, User } from "@/types/base";
import { setClientCookie } from "@/utils/clientCookies";
import { LOCALES_ANTD, THEMES_ANTD } from "@/utils/constants";

export function ClientProviders({
  children,
  appSettings,
  user,
}: {
  children: React.ReactNode;
  appSettings: AppSettings;
  user: User | null;
}) {
  const didHydrate = useRef(false);

  const storeSettings = useAppStore((s) => s.appSettings);
  const setAppSettings = useAppStore((s) => s.setAppSettings);
  const setUser = useAppStore((s) => s.setUser);

  // hidrata 1x com valores do server
  useEffect(() => {
    if (didHydrate.current) return;
    didHydrate.current = true;

    setAppSettings(appSettings);
    setUser(user);
  }, [appSettings, user, setAppSettings, setUser]);

  // user pode mudar depois
  useEffect(() => {
    if (!didHydrate.current) return;
    setUser(user);
  }, [user, setUser]);

  // fonte da verdade: store
  const theme = useMemo(
    () => THEMES_ANTD[storeSettings.theme],
    [storeSettings.theme],
  );

  const antdLocale: ConfigProviderProps["locale"] = useMemo(() => {
    return LOCALES_ANTD[storeSettings.locale];
  }, [storeSettings.locale]);

  useEffect(() => {
    const root = document.documentElement;
    if (storeSettings.theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    void setClientCookie("NEXT_LOCALE", storeSettings.locale);
    void setClientCookie("APP_THEME", storeSettings.theme);
  }, [storeSettings.theme, storeSettings.locale]);

  return (
    <ConfigProvider locale={antdLocale} theme={theme}>
      <App className="flex size-full flex-col">
        <IconContext.Provider value={{ size: "18" }}>
          {children}
        </IconContext.Provider>
      </App>
    </ConfigProvider>
  );
}
