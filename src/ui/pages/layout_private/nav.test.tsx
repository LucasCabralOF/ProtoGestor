import { describe, expect, it } from "vitest";
import type { NavLookupGroup } from "./nav-utils";
import { buildBreadcrumbItems, findNavItem, firstPath } from "./nav-utils";

const NAV_GROUPS: readonly NavLookupGroup[] = [
  {
    label: "Geral",
    items: [{ href: "/dashboard", label: "Dashboard" }],
  },
  {
    label: "Operação",
    items: [{ href: "/clients", label: "Clientes" }],
  },
];

describe("nav helpers", () => {
  it("extracts the first pathname segment", () => {
    expect(firstPath("/clients")).toBe("clients");
    expect(firstPath("/dashboard/metrics")).toBe("dashboard");
    expect(firstPath("/")).toBe("");
  });

  it("finds the registered nav item for the current route", () => {
    const found = findNavItem("/clients", NAV_GROUPS);

    expect(found).not.toBeNull();
    expect(found?.group).toBe("Operação");
    expect(found?.item.href).toBe("/clients");
    expect(found?.item.label).toBe("Clientes");
  });

  it("builds a fallback breadcrumb for unknown pages", () => {
    expect(buildBreadcrumbItems("/missing", NAV_GROUPS)).toEqual([
      { title: "Painel", href: "/dashboard" },
      { title: "Página" },
    ]);
  });
});
