"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState, useTransition } from "react";
import {
  FiBell,
  FiBriefcase,
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
import type { AppSettings, OrganizationSummary, User } from "@/types/base";
import { Breadcrumb } from "@/ui/base/Breadcrumb";
import { Button } from "@/ui/base/Button";
import { Input } from "@/ui/base/Input";
import { Popover } from "@/ui/base/Popover";
import { setClientCookie } from "@/utils/clientCookies";
import { ACTIVE_ORG_COOKIE, LOCALES, type LocaleKey } from "@/utils/constants";
import { buildBreadcrumbItems, buildPrivateNav } from "./nav";

export function Navbar({
  activeOrg,
  organizations,
  pathname,
  user,
  onOpenMobileSidebar,
}: {
  activeOrg: OrganizationSummary;
  organizations: OrganizationSummary[];
  pathname: string;
  user: User;
  onOpenMobileSidebar: () => void;
}) {
  const router = useRouter();
  const t = useTranslations("navigation");
  const [isSwitchingOrg, startSwitchingOrg] = useTransition();
  const groups = useMemo(() => buildPrivateNav(t), [t]);

  const appSettings = useAppStore((s) => s.appSettings);
  const setTheme = useAppStore((s) => s.setTheme);
  const setLocale = useAppStore((s) => s.setLocale);

  const [_busyLogout, setBusyLogout] = useState(false);

  function labelLocale(locale: LocaleKey) {
    if (locale === "pt-BR") return "PT";
    if (locale === "en") return "EN";
    return locale;
  }

  function labelLocaleOption(locale: LocaleKey) {
    if (locale === "pt-BR") return t("localePtBR");
    return t("localeEn");
  }

  function labelOrgRole(role: OrganizationSummary["role"]) {
    if (role === "owner") return t("roleOwner");
    if (role === "admin") return t("roleAdmin");
    return t("roleMember");
  }

  async function toggleTheme() {
    const nextTheme: AppSettings["theme"] =
      appSettings.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);

    await setClientCookie("APP_THEME", nextTheme);
    router.refresh();
  }

  async function changeLocale(locale: LocaleKey) {
    setLocale(locale);

    // seta cookie pro server ler e força rerender server components
    await setClientCookie("NEXT_LOCALE", locale);
    router.refresh();
  }

  async function changeOrganization(orgId: string) {
    if (orgId === activeOrg.id) return;

    await setClientCookie(ACTIVE_ORG_COOKIE, orgId);
    startSwitchingOrg(() => router.refresh());
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
          items={buildBreadcrumbItems(pathname, groups, {
            dashboard: t("breadcrumbDashboard"),
            page: t("breadcrumbPage"),
          })}
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
              placeholder={t("searchPlaceholder")}
            />
          </div>
        </div>

        <Popover
          triggerClick
          triggerHover={false}
          placement="bottom"
          content={(close) => (
            <div className="min-w-[260px]">
              <div className="border-b border-(--color-border) px-3 py-2 text-xs text-(--color-text-2)">
                {t("activeOrganization")}
              </div>

              {organizations.map((organization) => {
                const isCurrent = organization.id === activeOrg.id;

                return (
                  <button
                    key={organization.id}
                    type="button"
                    className={`w-full px-3 py-3 text-left transition hover:bg-(--color-base-3) ${
                      isCurrent ? "bg-(--color-base-3)" : ""
                    }`}
                    disabled={isSwitchingOrg}
                    onClick={() => {
                      close();
                      void changeOrganization(organization.id);
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">
                          {organization.name}
                        </div>
                        <div className="mt-1 truncate text-xs text-(--color-text-2)">
                          {organization.slug ?? t("unknownSlug")} •{" "}
                          {labelOrgRole(organization.role)}
                        </div>
                      </div>

                      {isCurrent ? (
                        <span className="rounded-full border border-(--color-border) bg-(--color-base-1) px-2 py-1 text-[11px] font-semibold">
                          {t("current")}
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        >
          <button
            type="button"
            className="hidden h-9 items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-base-4) px-3 hover:bg-(--color-base-3) md:flex"
          >
            <FiBriefcase />
            <span className="max-w-[160px] truncate text-sm font-medium">
              {activeOrg.name}
            </span>
            <FiChevronDown className="text-(--color-text-2)" />
          </button>
        </Popover>

        {/* Language */}
        <Popover
          triggerClick
          triggerHover={false}
          placement="bottom"
          content={(close) => (
            <div className="min-w-[180px]">
              <div className="px-3 py-2 border-b border-(--color-border) text-xs text-(--color-text-2)">
                {t("language")}
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
                    void changeLocale(loc);
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    <FiGlobe />
                    {labelLocaleOption(loc)}
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
        <Button fit testid="theme-toggle" onClick={() => void toggleTheme()}>
          {appSettings.theme === "dark" ? <FiSun /> : <FiMoon />}
        </Button>

        {/* Notifications */}
        <Button fit testid="notif">
          <FiBell />
          <span className="sr-only">{t("notifications")}</span>
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
                <div className="mt-1 truncate text-[11px] text-(--color-text-2)">
                  {activeOrg.name}
                </div>
              </div>

              {organizations.length > 1 ? (
                <div className="border-t border-(--color-border) px-2 py-2">
                  <div className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wide text-(--color-text-2)">
                    {t("organizations")}
                  </div>

                  <div className="grid gap-1">
                    {organizations.map((organization) => {
                      const isCurrent = organization.id === activeOrg.id;

                      return (
                        <button
                          key={organization.id}
                          type="button"
                          className={`rounded-lg px-2 py-2 text-left text-sm transition hover:bg-(--color-base-3) ${
                            isCurrent ? "bg-(--color-base-3)" : ""
                          }`}
                          disabled={isSwitchingOrg}
                          onClick={() => {
                            close();
                            void changeOrganization(organization.id);
                          }}
                        >
                          <div className="truncate font-medium">
                            {organization.name}
                          </div>
                          <div className="truncate text-[11px] text-(--color-text-2)">
                            {labelOrgRole(organization.role)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <button
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-(--color-base-3)"
                onClick={() => {
                  close();
                  router.push("/settings");
                }}
              >
                {t("settings")}
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
                  <FiLogOut /> {t("logout")}
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
