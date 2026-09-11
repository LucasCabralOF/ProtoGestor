import type { BreadcrumbProps } from "antd";
import type { ReactNode } from "react";
import {
  FiBarChart2,
  FiCalendar,
  FiClipboard,
  FiDollarSign,
  FiHome,
  FiSettings,
  FiUsers,
} from "react-icons/fi";
import type { OrgRoleKey } from "@/types/base";
import {
  buildBreadcrumbItems as buildBreadcrumbItemsForGroups,
  findNavItem as findNavItemForGroups,
  firstPath,
} from "./nav-utils";

export type NavItem = {
  href: string;
  icon: ReactNode;
  label: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export function buildPrivateNav(
  t: (key: string) => string,
  role?: OrgRoleKey,
): NavGroup[] {
  const isMember = role === "member";

  const operationItems: NavItem[] = [
    { href: "/clients", label: t("itemClients"), icon: <FiUsers /> },
    { href: "/schedule", label: t("itemSchedule"), icon: <FiCalendar /> },
    { href: "/services", label: t("itemServices"), icon: <FiClipboard /> },
  ];

  // Apenas Donos e Administradores têm acesso a Finanças e Relatórios
  if (!isMember) {
    operationItems.push(
      { href: "/finance", label: t("itemFinance"), icon: <FiDollarSign /> },
      { href: "/reports", label: t("itemReports"), icon: <FiBarChart2 /> },
    );
  }

  return [
    {
      label: t("groupGeneral"),
      items: [
        { href: "/dashboard", label: t("itemDashboard"), icon: <FiHome /> },
      ],
    },
    {
      label: t("groupOperations"),
      items: operationItems,
    },
    {
      label: t("groupSystem"),
      items: [
        { href: "/settings", label: t("itemSettings"), icon: <FiSettings /> },
      ],
    },
  ];
}

export function findNavItem(pathname: string, groups: readonly NavGroup[]) {
  return findNavItemForGroups(pathname, groups);
}

export function buildBreadcrumbItems(
  pathname: string,
  groups: readonly NavGroup[],
  labels?: {
    dashboard: string;
    page: string;
  },
): BreadcrumbProps["items"] {
  return buildBreadcrumbItemsForGroups(pathname, groups, labels);
}

export { firstPath };
