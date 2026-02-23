"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { FiLogOut, FiMoon, FiSun } from "react-icons/fi";

import { authClient } from "@/lib/auth-client";
import { useAppStore } from "@/stores/appStore";
import type { AppSettings } from "@/types/base";
import { Button } from "@/ui/base";

type NavItem = { label: string; href: string };

export function PrivateShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();

  const appSettings = useAppStore((s) => s.appSettings);
  const setAppSettings = useAppStore((s) => s.setAppSettings);

  const [busy, setBusy] = useState(false);

  const nav: NavItem[] = useMemo(
    () => [{ label: t("dashboard"), href: "/dashboard" }],
    [t],
  );

  async function onLogout() {
    setBusy(true);
    try {
      await authClient.signOut();
      router.push("/login");
    } finally {
      setBusy(false);
    }
  }

  function toggleTheme() {
    const nextTheme: AppSettings["theme"] =
      appSettings.theme === "dark" ? "light" : "dark";
    setAppSettings({ ...appSettings, theme: nextTheme });
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-(--color-base-4) text-(--color-text-1)">
      <aside className="w-64 border-r border-(--color-border) bg-(--color-base-4) flex flex-col">
        <div className="h-14 px-4 flex items-center border-b border-(--color-border)">
          <div className="font-semibold">{t("appTitle")}</div>
        </div>

        <nav className="p-3 flex-1 overflow-auto">
          <div className="space-y-1">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={[
                    "block rounded-lg px-3 py-2 text-sm",
                    active
                      ? "bg-(--color-base-3) border border-(--color-border)"
                      : "hover:bg-(--color-base-3)",
                  ].join(" ")}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </nav>

        <div className="p-3 border-t border-(--color-border) flex gap-2">
          <Button testid="theme-toggle" fit onClick={toggleTheme}>
            {appSettings.theme === "dark" ? <FiSun /> : <FiMoon />}
            <span className="text-sm">
              {appSettings.theme === "dark" ? "Light" : "Dark"}
            </span>
          </Button>

          <Button testid="logout" fit danger loading={busy} onClick={onLogout}>
            <FiLogOut />
            <span className="text-sm">{t("logout")}</span>
          </Button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-auto">
        <div className="h-14 border-b border-(--color-border) px-4 flex items-center justify-between bg-(--color-base-4)">
          <div className="text-sm text-(--color-text-2)">{pathname}</div>
        </div>

        <div className="p-4">{children}</div>
      </main>
    </div>
  );
}
