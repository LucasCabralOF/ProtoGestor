"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import type { User } from "@/types/base";

import { Sidebar } from "@/ui/pages/private/Sidebar";
import { MobileSidebar } from "@/ui/pages/private/MobileSidebar";
import { Navbar } from "@/ui/pages/private/Navbar";
import { PRIVATE_NAV } from "@/ui/pages/private/nav";

export function PrivateShell({ children, user }: { children: React.ReactNode; user: User }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-(--color-base-3) text-(--color-text-1)">
      <div className="flex h-full w-full">
        {/* Desktop sidebar */}
        <Sidebar groups={PRIVATE_NAV} />

        {/* Mobile drawer sidebar */}
        <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} groups={PRIVATE_NAV} />

        <div className="flex-1 min-w-0 flex flex-col">
          <Navbar
            pathname={pathname}
            user={user}
            onOpenMobileSidebar={() => setMobileOpen(true)}
          />

          <main className="flex-1 min-h-0 overflow-auto">
            <div className="p-4">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}