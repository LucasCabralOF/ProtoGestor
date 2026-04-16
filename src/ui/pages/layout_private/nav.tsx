import type { BreadcrumbProps } from "antd";
import type { ReactNode } from "react";
import {
  FiBarChart2,
  FiCalendar,
  FiHome,
  FiLayout,
  FiSettings,
  FiUsers,
} from "react-icons/fi";
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

export function buildPrivateNav(t: (key: string) => string): NavGroup[] {
  return [
    {
      label: t("groupGeneral"),
      items: [
        { href: "/dashboard", label: t("itemDashboard"), icon: <FiHome /> },
      ],
    },
    {
      label: t("groupOperations"),
      items: [
        { href: "/clients", label: t("itemClients"), icon: <FiUsers /> },
        { href: "/services", label: t("itemServices"), icon: <FiCalendar /> },
        { href: "/projects", label: t("itemProjects"), icon: <FiLayout /> },
        { href: "/reports", label: t("itemReports"), icon: <FiBarChart2 /> },
      ],
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
