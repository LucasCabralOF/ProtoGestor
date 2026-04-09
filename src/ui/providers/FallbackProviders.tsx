"use client";

import { App, ConfigProvider } from "antd";
import { IconContext } from "react-icons";
import {
  DEFAULT_LOCALE,
  DEFAULT_THEME,
  LOCALES_ANTD,
  THEMES_ANTD,
} from "@/utils/constants";

export function FallbackProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      locale={LOCALES_ANTD[DEFAULT_LOCALE]}
      theme={THEMES_ANTD[DEFAULT_THEME]}
    >
      <App className="flex size-full flex-col">
        <IconContext.Provider value={{ size: "18" }}>
          {children}
        </IconContext.Provider>
      </App>
    </ConfigProvider>
  );
}
