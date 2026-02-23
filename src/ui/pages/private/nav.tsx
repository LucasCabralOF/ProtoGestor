import { FiHome, FiLayout, FiSettings, FiUsers } from "react-icons/fi";
import type { BreadcrumbProps } from "antd";

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
    items: [{ href: "/settings", label: "Configurações", icon: <FiSettings /> }],
  },
];

export function firstPath(pathname: string) {
  return pathname.split("/")[1] ?? "";
}

export function findNavItem(pathname: string) {
  const key = `/${firstPath(pathname)}`;
  for (const group of PRIVATE_NAV) {
    const found = group.items.find((i) => i.href === key);
    if (found) return { group: group.label, item: found };
  }
  return null;
}

export function buildBreadcrumbItems(pathname: string): BreadcrumbProps["items"] {
  const found = findNavItem(pathname);

  if (!found) {
    return [{ title: "Painel", href: "/dashboard" }, { title: "Página" }];
  }

  return [
    { title: "Painel", href: "/dashboard" },
    { title: found.group },
    { title: found.item.label },
  ];
}