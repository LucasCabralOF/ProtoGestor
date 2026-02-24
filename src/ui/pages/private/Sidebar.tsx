// src/ui/pages/private/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { RiSideBarLine } from "react-icons/ri";

import { Popover } from "@/ui/base/Popover";
import type { NavGroup } from "@/ui/pages/private/nav";
import { firstPath } from "@/ui/pages/private/nav";

function SidebarItem({
  collapsed,
  active,
  label,
  href,
  icon,
  onNavigate,
}: {
  collapsed: boolean;
  active: boolean;
  label: string;
  href: string;
  icon: React.ReactNode;
  onNavigate?: () => void;
}) {
  return (
    <Popover
      content={() => <div className="p-2 text-sm">{label}</div>}
      disabled={!collapsed}
      placement="right"
      triggerClick={false}
      triggerHover
    >
      <Link
        href={href}
        onClick={onNavigate}
        className={`flex w-full items-center rounded-lg border transition-colors ${
          active
            ? "bg-(--color-base-3) border-(--color-border) text-(--color-text-1)"
            : "border-transparent text-(--color-text-2) hover:bg-(--color-base-3) hover:border-(--color-border) hover:text-(--color-text-1)"
        }`}
      >
        <div className="flex size-10 min-w-10 items-center justify-center text-lg">
          {icon}
        </div>
        <span
          className={`min-w-0 truncate pr-3 text-sm ${collapsed ? "hidden" : "block"} ${active ? "font-medium" : ""}`}
        >
          {label}
        </span>
      </Link>
    </Popover>
  );
}

export function Sidebar({
  groups,
  onNavigate,
}: {
  groups: NavGroup[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const current = firstPath(pathname);

  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden md:flex h-full flex-col bg-(--color-base-4) border-r border-(--color-border) transition-all duration-150 ease-in-out ${
        collapsed ? "w-16 min-w-16 max-w-16" : "w-64 min-w-64 max-w-64"
      }`}
    >
      {/* Brand */}
      <div className="h-14 flex items-center gap-2 px-3 border-b border-(--color-border)">
        <div className="flex size-9 items-center justify-center rounded-xl bg-(--color-base-3) border border-(--color-border) font-semibold">
          P
        </div>

        <div className={`${collapsed ? "hidden" : "block"} min-w-0`}>
          <div className="text-sm font-semibold leading-4 truncate">Proto</div>
          <div className="text-xs text-(--color-text-2) leading-4 truncate">
            Sistema
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-auto p-2">
        {groups.map((group) => (
          <div key={group.label} className="mb-4">
            <div
              className={`px-2 pb-1 text-[11px] uppercase tracking-wide text-(--color-text-2) ${collapsed ? "hidden" : "block"}`}
            >
              {group.label}
            </div>

            <div className="flex flex-col gap-1">
              {group.items.map((item) => (
                <SidebarItem
                  key={item.href}
                  collapsed={collapsed}
                  active={current === item.href.replace("/", "")}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Collapse */}
      <div className="p-2 border-t border-(--color-border)">
        <button
          type="button"
          title="Alternar sidebar"
          onClick={() => setCollapsed((v) => !v)}
          className="flex size-10 items-center justify-center rounded-lg border border-transparent hover:bg-(--color-base-3) hover:border-(--color-border)"
        >
          <RiSideBarLine className="text-(--color-text-2) text-lg" />
        </button>
      </div>
    </aside>
  );
}
