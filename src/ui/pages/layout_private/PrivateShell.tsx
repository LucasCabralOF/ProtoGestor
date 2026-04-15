"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { OrganizationSummary, User } from "@/types/base";
import { MobileSidebar } from "@/ui/pages/layout_private/MobileSidebar";
import { Navbar } from "@/ui/pages/layout_private/Navbar";
import { buildPrivateNav } from "@/ui/pages/layout_private/nav";
import { Sidebar } from "@/ui/pages/layout_private/Sidebar";

export function PrivateShell({
  activeOrg,
  children,
  organizations,
  user,
}: {
  activeOrg: OrganizationSummary;
  children: React.ReactNode;
  organizations: OrganizationSummary[];
  user: User;
}) {
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const [mobileOpen, setMobileOpen] = useState(false);
  const groups = useMemo(() => buildPrivateNav(t), [t]);

  return (
    <div className="app-shell h-screen w-screen overflow-hidden bg-(--color-base-3) text-(--color-text-1)">
      <div className="app-shell-layout flex h-full w-full">
        {/* Desktop sidebar */}
        <div className="app-shell-sidebar">
          <Sidebar
            groups={groups}
            brandSubtitle={t("sidebarSystem")}
            toggleTitle={t("toggleSidebar")}
          />
        </div>

        {/* Mobile drawer sidebar */}
        <MobileSidebar
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          closeLabel={t("close")}
          groups={groups}
          title={t("mobileMenu")}
        />

        <div className="app-shell-body flex-1 min-w-0 flex flex-col">
          <div className="app-shell-navbar">
            <Navbar
              activeOrg={activeOrg}
              organizations={organizations}
              pathname={pathname}
              user={user}
              onOpenMobileSidebar={() => setMobileOpen(true)}
            />
          </div>

          <main className="app-shell-main flex-1 min-h-0 overflow-auto">
            <div className="app-shell-page p-4">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
