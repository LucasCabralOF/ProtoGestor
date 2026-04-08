import type { BreadcrumbProps } from "antd";
import { FiHome, FiLayout, FiSettings, FiUsers } from "react-icons/fi";
import {
  buildBreadcrumbItems as buildBreadcrumbItemsForGroups,
  findNavItem as findNavItemForGroups,
  firstPath,
} from "./nav-utils";

export type NavItem = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const PRIVATE_NAV: NavGroup[] = [
  {
    label: "Geral",
    items: [{ href: "/dashboard", label: "Dashboard", icon: <FiHome /> }],
  },
  {
    label: "Operação",
    items: [
      { href: "/clients", label: "Clientes", icon: <FiUsers /> },
      { href: "/projects", label: "Projetos", icon: <FiLayout /> },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/settings", label: "Configurações", icon: <FiSettings /> },
    ],
  },
];

export function findNavItem(pathname: string) {
  return findNavItemForGroups(pathname, PRIVATE_NAV);
}

export function buildBreadcrumbItems(
  pathname: string,
): BreadcrumbProps["items"] {
  return buildBreadcrumbItemsForGroups(pathname, PRIVATE_NAV);
}

export { firstPath };
