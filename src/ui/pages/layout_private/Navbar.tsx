"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FiBell,
  FiChevronDown,
  FiGlobe,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiSearch,
  FiSun,
} from "react-icons/fi";
import { signOut } from "@/actions/authActions";
import { useAppStore } from "@/stores/appStore";
import type { AppSettings, User } from "@/types/base";
import { Breadcrumb } from "@/ui/base/Breadcrumb";
import { Button } from "@/ui/base/Button";
import { Input } from "@/ui/base/Input";
import { Popover } from "@/ui/base/Popover";
import { LOCALES, type LocaleKey } from "@/utils/constants";
import { buildBreadcrumbItems } from "./nav";

function labelLocale(locale: LocaleKey) {
  if (locale === "pt-BR") return "PT";
  if (locale === "en") return "EN";
  return locale;
}

export function Navbar({
  pathname,
  user,
  onOpenMobileSidebar,
}: {
  pathname: string;
  user: User;
  onOpenMobileSidebar: () => void;
}) {
  const router = useRouter();

  const appSettings = useAppStore((s) => s.appSettings);
  const setTheme = useAppStore((s) => s.setTheme);
  const setLocale = useAppStore((s) => s.setLocale);

  const [_busyLogout, setBusyLogout] = useState(false);

  function toggleTheme() {
    const nextTheme: AppSettings["theme"] =
      appSettings.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);

    document.cookie = `APP_THEME=${encodeURIComponent(nextTheme)}; Path=/; Max-Age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }

  function changeLocale(locale: LocaleKey) {
    setLocale(locale);

    // seta cookie pro server ler e força rerender server components
    document.cookie = `NEXT_LOCALE=${encodeURIComponent(locale)}; Path=/; Max-Age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }

  async function onLogout() {
    setBusyLogout(true);
    try {
      await signOut();
      router.push("/login");
    } finally {
      setBusyLogout(false);
    }
  }

  const initials = (user.name ?? "U").slice(0, 1).toUpperCase();

  return (
    <header className="h-14 w-full flex items-center gap-3 px-4 border-b border-(--color-border) bg-(--color-base-4)">
      {/* Mobile menu */}
      <div className="md:hidden">
        <Button fit testid="open-mobile-sidebar" onClick={onOpenMobileSidebar}>
          <FiMenu />
        </Button>
      </div>

      {/* Breadcrumb */}
      <div className="min-w-0">
        <Breadcrumb
          items={buildBreadcrumbItems(pathname)}
          className="text-sm"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Search desktop */}
        <div className="hidden md:flex items-center w-[340px]">
          <div className="relative w-full">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-2)">
              <FiSearch />
            </div>
            <Input
              className="pl-10"
              testid="top-search"
              placeholder="Buscar..."
            />
          </div>
        </div>

        {/* Language */}
        <Popover
          triggerClick
          triggerHover={false}
          placement="bottom"
          content={(close) => (
            <div className="min-w-[180px]">
              <div className="px-3 py-2 border-b border-(--color-border) text-xs text-(--color-text-2)">
                Idioma
              </div>

              {(LOCALES as readonly LocaleKey[]).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-(--color-base-3) ${
                    appSettings.locale === loc ? "font-medium" : ""
                  }`}
                  onClick={() => {
                    close();
                    changeLocale(loc);
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    <FiGlobe />
                    {loc === "pt-BR" ? "Português (BR)" : "English"}
                  </span>
                </button>
              ))}
            </div>
          )}
        >
          <Button fit testid="locale-toggle">
            <FiGlobe />
            <span className="text-sm">
              {labelLocale(appSettings.locale as LocaleKey)}
            </span>
          </Button>
        </Popover>

        {/* Theme */}
        <Button fit testid="theme-toggle" onClick={toggleTheme}>
          {appSettings.theme === "dark" ? <FiSun /> : <FiMoon />}
        </Button>

        {/* Notifications */}
        <Button fit testid="notif">
          <FiBell />
        </Button>

        {/* User menu */}
        <Popover
          triggerClick
          triggerHover={false}
          placement="bottomRight"
          content={(close) => (
            <div className="min-w-[220px]">
              <div className="px-3 py-2 border-b border-(--color-border)">
                <div className="text-sm font-semibold truncate">
                  {user.name}
                </div>
                <div className="text-xs text-(--color-text-2) truncate">
                  {user.email ?? ""}
                </div>
              </div>

              <button
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-(--color-base-3)"
                onClick={() => {
                  close();
                  router.push("/settings");
                }}
              >
                Configurações
              </button>

              <button
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-(--color-base-3) text-(--color-error)"
                onClick={() => {
                  close();
                  onLogout();
                }}
              >
                <span className="inline-flex items-center gap-2">
                  <FiLogOut /> Sair
                </span>
              </button>
            </div>
          )}
        >
          <button
            type="button"
            className="flex items-center gap-2 h-9 px-3 rounded-xl border border-(--color-border) bg-(--color-base-4) hover:bg-(--color-base-3)"
          >
            <div className="size-7 rounded-lg bg-(--color-base-3) border border-(--color-border) flex items-center justify-center text-xs font-semibold">
              {initials}
            </div>

            <div className="hidden md:flex flex-col items-start leading-4 min-w-0">
              <div className="text-xs font-semibold truncate max-w-[140px]">
                {user.name}
              </div>
              <div className="text-[11px] text-(--color-text-2) truncate max-w-[140px]">
                {user.email ?? ""}
              </div>
            </div>

            <FiChevronDown className="text-(--color-text-2)" />
          </button>
        </Popover>
      </div>
    </header>
  );
}
