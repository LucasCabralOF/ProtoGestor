// src/ui/pages/private/MobileSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Drawer } from "@/ui/base/Drawer";
import type { NavGroup } from "@/ui/pages/layout_private/nav";
import { firstPath } from "@/ui/pages/layout_private/nav";

export function MobileSidebar({
  open,
  onClose,
  groups,
}: {
  open: boolean;
  onClose: () => void;
  groups: NavGroup[];
}) {
  const pathname = usePathname();
  const current = firstPath(pathname);

  return (
    <div className="md:hidden">
      <Drawer
        open={open}
        onClose={onClose}
        placement="left"
        size="large"
        testid="mobile-sidebar"
        title="Menu"
      >
        <div className="h-full bg-(--color-base-4) flex flex-col">
          <div className="p-2">
            {groups.map((group) => (
              <div key={group.label} className="mb-4">
                <div className="px-2 pb-1 text-[11px] uppercase tracking-wide text-(--color-text-2)">
                  {group.label}
                </div>

                <div className="flex flex-col gap-1">
                  {group.items.map((item) => {
                    const active = current === item.href.replace("/", "");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-3 rounded-lg border px-3 h-11 transition-colors ${
                          active
                            ? "bg-(--color-base-3) border-(--color-border) text-(--color-text-1)"
                            : "border-transparent text-(--color-text-2) hover:bg-(--color-base-3) hover:border-(--color-border) hover:text-(--color-text-1)"
                        }`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span
                          className={`text-sm ${active ? "font-medium" : ""}`}
                        >
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto p-2 border-t border-(--color-border)">
            <button
              type="button"
              onClick={onClose}
              className="w-full h-11 rounded-lg border border-(--color-border) hover:bg-(--color-base-3)"
            >
              Fechar
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
