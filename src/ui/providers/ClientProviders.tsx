"use client";

import { App, ConfigProvider, type ConfigProviderProps } from "antd";
import { useEffect } from "react";
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
  const setAppSettings = useAppStore((state) => state.setAppSettings);
  const setUser = useAppStore((state) => state.setUser);
  const theme = THEMES_ANTD[appSettings.theme];

  useEffect(() => {
    setAppSettings(appSettings);
    setUser(user);
  }, [appSettings, user]);

  return (
    <ConfigProvider locale={locale} theme={theme}>
      <App className="flex size-full flex-col">
        <IconContext.Provider value={{ size: "18" }}>
          {children}
        </IconContext.Provider>
      </App>
    </ConfigProvider>
  );
}
